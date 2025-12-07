import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Server-side Pusher instance
export const pusherServer = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
})

// Client-side Pusher instance
export const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,
    {
        cluster: process.env.PUSHER_CLUSTER!,
    }
)

// Trigger events
export async function triggerRideUpdate(rideId: string, data: any) {
    await pusherServer.trigger(`ride-${rideId}`, 'ride-update', data)
}

export async function triggerDriverNotification(driverId: string, data: any) {
    await pusherServer.trigger(`driver-${driverId}`, 'new-ride-request', data)
}

export async function triggerRiderNotification(riderId: string, data: any) {
    await pusherServer.trigger(`rider-${riderId}`, 'ride-status-update', data)
}
