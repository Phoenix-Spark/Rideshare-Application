import { Prisma } from "@prisma/client";
import { prisma } from "../db.server";

function generateInviteCode(length = 15): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return code;
}

export async function createInvite(email: string, userId: string) {
    try {
        const normalizedEmail = email.toLowerCase();

        if (normalizedEmail.endsWith(".mil")) {
            return { invite: null, error: "Military emails cannot be used as an invite." };
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });

        if (!user) {
            return { invite: null, error: "User not found." };
        }

        if (user.email.toLowerCase() === normalizedEmail) {
            return { invite: null, error: "You cannot invite yourself." };
        }

        const inviteCount = await prisma.invite.count({
            where: { userId },
        });

        if (inviteCount >= 5) {
            return { invite: null, error: "You have reached the maximum of 5 invites." };
        }

        const invite = await prisma.invite.create({
            data: {
                email: normalizedEmail,
                userId,
                code: generateInviteCode(),
            },
        });

        return { invite, error: null };
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            return { invite: null, error: "An invite for this email already exists." };
        }
        return { invite: null, error: "Something went wrong creating the invite." };
    }
}

export async function getInvites(userId: string) {
    const invite = await prisma.invite.findMany({
        where: { userId },
        orderBy: {
            email: 'asc',
        },
        select: {
            id: true,
            email: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            createdAt: true,
            updatedAt: true,
            isActive: true,
            code: true,
        },
    });
    return invite;
}

export async function updateInvite(id: string) {
    const invite = await prisma.invite.findUnique({
        where: { id },
        select: { id: true, updatedAt: true },
    });

    if (!invite) {
        throw new Error("Invite not found.");
    }

    const now = new Date();
    const lastUpdated = new Date(invite.updatedAt);

    const diffMs = now.getTime() - lastUpdated.getTime();
    if (diffMs < 60_000) {
        return { invite: null, error: "Please wait 1 minute to regenerate a new key." };
    }

    const updatedInvite = await prisma.invite.update({
        where: { id },
        data: {
            code: generateInviteCode(),
            updatedAt: now,
        },
    });

    return updatedInvite;
}

export async function disableInvite(id: string) {
    const invite = await prisma.invite.update({
        where: { id },
        data: {
            isActive: false,
            updatedAt: new Date(Date.now())
        },
    });

    return invite;
}

export async function enableInvite(id: string) {
    const invite = await prisma.invite.update({
        where: { id },
        data: {
            isActive: true,
            updatedAt: new Date(Date.now())
        },
    });

    return invite;
}

export async function deleteInvite(id: string) {
    const invite = await prisma.invite.delete({
        where: { id },
    });

    return invite;
}

