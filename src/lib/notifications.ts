import { prisma } from './db'

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'milestone'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title?: string // Custom title (used for milestones)
  message?: string // Custom message (used for milestones)
  relatedUserId?: string
  postId?: string
  photoId?: string
  commentId?: string
}

/**
 * Create a notification for a user
 */
export async function createNotification({
  userId,
  type,
  title: customTitle,
  message: customMessage,
  relatedUserId,
  postId,
  photoId,
  commentId,
}: CreateNotificationParams) {
  try {
    const titles: Record<NotificationType, string> = {
      like: 'New like on your post',
      comment: 'New comment on your post',
      follow: 'New follower',
      mention: 'You were mentioned',
      milestone: 'Milestone Reached!',
    }

    const messages: Record<NotificationType, string> = {
      like: 'Someone liked your post',
      comment: 'Someone commented on your post',
      follow: 'Someone started following you',
      mention: 'You were mentioned in a post',
      milestone: 'You reached a program milestone!',
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title: customTitle || titles[type],
        message: customMessage || messages[type],
        relatedUserId: relatedUserId || null,
        postId: postId || null,
        photoId: photoId || null,
        commentId: commentId || null,
      },
    })

    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return notification
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return null
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return true
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return false
  }
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadNotificationCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    })

    return count
  } catch (error) {
    console.error('Error getting unread count:', error)
    return 0
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string) {
  try {
    await prisma.notification.delete({
      where: { id: notificationId },
    })

    return true
  } catch (error) {
    console.error('Error deleting notification:', error)
    return false
  }
}
