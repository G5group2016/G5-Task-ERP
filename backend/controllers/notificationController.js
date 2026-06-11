const Notification =
    require(
        "../models/Notification"
    );

exports.getNotifications =
async (req, res) => {

    try {

        const notifications =
            await Notification.find()
            .sort({
                createdAt: -1
            });

        const unreadCount =
            await Notification.countDocuments({
                isRead: false
            });

        res.json({
            success: true,
            notifications,
            unreadCount
        });

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

};

exports.markAllAsRead =
    async (req, res) => {

        try {

            await Notification.updateMany(
                { isRead: false },
                { isRead: true }
            );

            res.json({
                success: true
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }
    };