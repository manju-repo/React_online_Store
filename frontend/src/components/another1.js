import React, { createContext, useMemo, useState } from "react";
import { GlobalNotificationType } from "@/types/Notification";


interface GlobalNotificationsContextInterface {
    notification: string;
    description: string;
    type: GlobalNotificationType | null;
    visible: boolean;
    showNotification: (message: string, description: string, type: GlobalNotificationType, duration?: number) => void;
}

const defaultState: GlobalNotificationsContextInterface = {
    notification: "",
    description: "",
    type: null,
    visible: false,
    showNotification: () => { }
}

const GlobalNotificationContext = createContext<GlobalNotificationsContextInterface>(defaultState);

interface GlobalNotificationProviderProps {
    children: React.ReactNode;
}


const GlobalNotificationsProvider: React.FC<GlobalNotificationProviderProps> = ({ children }) => {
    const [notification, setNotification] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<GlobalNotificationType | null>(null);
    const [visible, setVisible] = useState(false);

    const showNotification = (message: string, description: string, type: GlobalNotificationType, duration = 4500) => {
        setNotification(message);
        setDescription(description);
        setType(type);
        setVisible(true);
        setTimeout(() => setVisible(false), duration);
    };

    const value = useMemo(() => ({
        notification,
        description,
        type,
        visible,
        showNotification
    }), [notification, description, type, visible]);

    return (
        <GlobalNotificationContext.Provider value={value}>
            {children}
        </GlobalNotificationContext.Provider>
    );
}


const useGlobalNotifications = () => {
    const context = React.useContext(GlobalNotificationContext);

    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }

    return context;
}


export { GlobalNotificationsProvider, useGlobalNotifications }