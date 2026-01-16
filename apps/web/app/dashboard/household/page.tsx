import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import HouseholdManagement from '@/components/HouseholdManagement';

export default async function HouseholdPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch user's households
  const ownedHouseholds = await prisma.household.findMany({
    where: { ownerId: session.user.id },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          preferences: true,
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      invitations: {
        where: {
          acceptedAt: null,
          expiresAt: {
            gte: new Date(),
          },
        },
        include: {
          inviterUser: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const memberHouseholds = await prisma.household.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
      ownerId: {
        not: session.user.id,
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          preferences: true,
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      invitations: {
        where: {
          acceptedAt: null,
          expiresAt: {
            gte: new Date(),
          },
        },
        include: {
          inviterUser: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const households = [...ownedHouseholds, ...memberHouseholds];

  return (
    <HouseholdManagement
      households={households}
      userId={session.user.id}
      userEmail={session.user.email || ''}
    />
  );
}
