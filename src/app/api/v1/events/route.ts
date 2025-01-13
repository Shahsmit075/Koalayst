import { FREE_QUOTA, PRO_QUOTA } from "@/config"
import { db } from "@/db"
import { DiscordClient } from "@/lib/discord-client"
import { Description } from "@radix-ui/react-dialog"
import { timeStamp } from "console"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const REQUEST_VALIDATOR = z
    .object({
        category: z.string().optional(),
        fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
        description: z.string().optional(),
    }).strict()

export const POST = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.get("Authorization")

        if(!authHeader) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
    
        if(!authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Invalide Auth Header Format. Expected: `Bearer [API_KEY]`" }, { status: 401 })
        }
    
        const apiKey = authHeader.split(" ")[1]
    
        if(!apiKey || apiKey.trim() === "") {
            return NextResponse.json({ message: "Invalid API Key" }, { status: 401 })
        }
    
        const user = await db.user.findUnique({
            where: { apiKey },
            include: { EventCategories: true },
        })
    
        if(!user) {
            return NextResponse.json({ message: "Invalid API Key" }, { status: 401 })
        }
    
        if(!user.discordId) {
            return NextResponse.json({ message: "Discord ID Required!! Please update it in settings!!" }, { status: 403 })
        }
    
        //logic:
        const currentData = new Date()
        const currentMonth = currentData.getMonth() + 1
        const currentYear = currentData.getFullYear()
    
        const quota = await db.quota.findUnique({
            where: {
                userId: user.id,
                month: currentMonth,
                year: currentYear,
            },
        })
          
        const quotaLimit = user.plan === "FREE" ? FREE_QUOTA.maxEventsPerMonth : PRO_QUOTA.maxEventsPerMonth 
    
        if(quota && quota.count >= quotaLimit) {
            return NextResponse.json({ message: "Monthly limit reached" }, { status: 429 })
        }
    
        const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN)
    
        const dmChannel = await discord.createDM(user.discordId)
        console.log(dmChannel);
        // await discord.sendEmbed(dmChannel.id, {
        //     title: "Discord Successfully Connected",
        // })
    
        let requestData: unknown 
    
        try{
            requestData = await req.json()
        } catch(e) {
            return NextResponse.json({ message: "Invalid JSON Request Body" }, { status: 400 })
        }
    
        const validationResult = REQUEST_VALIDATOR.parse(requestData)
    
        const category = user.EventCategories.find(
          (cat) => cat.name === validationResult.category
        )
    
        if (!category) {
          return NextResponse.json(
            {
              message: `You dont have a category named "${validationResult.category}"`,
            },
            { status: 404 }
          )
        }
    
        const eventData = {
            title : `${category.emoji || "🐨"}
            ${category.name.charAt(0).toUpperCase() + category.name.slice(1)}`,
            description: validationResult.description || `A new ${category.name} event has occured!`,
            color: category.color,
            timestamp: new Date().toISOString(),
            fields: Object.entries(validationResult.fields || {}).map(
                ([keyof, value]) => {
                    return {
                        name: keyof,
                        value: String(value),
                        inline: true,
                    }
                }
            ),
        }
    
        const event = await db.event.create({
            data:{
                name: category.name,
                formattedMessage: `${eventData.title} \n\n ${eventData.description}`,
                userId: user.id,
                fields: validationResult.fields || {},
                eventCategoryId: category.id,
            },
        })
    
        try{
            await discord.sendEmbed(dmChannel.id, eventData)
    
            await db.event.update({
                where: { id: event.id },
                data: { deliveryStatus: "DELIVERED" },
            })
    
            await db.quota.upsert({
                where: {
                    userId: user.id,
                    month: currentMonth,
                    year: currentYear,
                },
                update: {
                    count: {
                        increment: 1,
                    },
                },
                create: {
                    userId: user.id,
                    month: currentMonth,
                    year: currentYear,
                    count: 1,
                },
                
            })
        } catch(err) {    
            await db.event.update({
                where: { id: event.id },
                data: { deliveryStatus: "FAILED" },
            })
    
            console.error(err)
    
            return NextResponse.json({ 
                message: "Failed to send event to discord",
                eventId: event.id,
            }, { status: 500 })
        }
    
        return NextResponse.json({ message: "Event Sent Successfully", eventId: event.id })
    }
    catch(err) {
        console.error(err)
        if(err instanceof z.ZodError) {
            return NextResponse.json({ message: err.message }, { status: 422 })
        }

        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
