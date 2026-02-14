
import React from 'react';
import { MaterialIcons, FontAwesome, FontAwesome5, Entypo, Ionicons } from '@expo/vector-icons'
import { Image } from 'react-native';

const activityHandlers: Record<string, (data: any) => string> = {
    book_details: (activity: any) => {
        return activity.book_title + " বইটি পড়েছেন।";
    },

    create_book: (activity: any) => {
        return activity.book_title + " বইটি পোস্ট করেছেন।";
    },

    update_book: (activity: any) => {
        return activity.book_title + " বইটি আপডেট করেছেন।";
    },

    delete_book: (activity: any) => {
        return activity.book_title + " বইটি রিমুভ করেছেন।";
    },

    update_book_permission: (activity: any) => {
        return activity.book_title + " বইটির পারমিশন পরিবর্তন করেছেন।";
    },

    library_book_added: (activity: any) => {
        return activity.book_title + " বইটি লাইব্রেরীতে যুক্ত করেছেন।";
    },

    library_book_remove: (activity: any) => {
        return activity.book_title + " বইটি লাইব্রেরী থেকে রিমুভ করেছেন।";
    },

    create_review: (activity: any) => {
        return activity.book_title + " টি তে রিভিউ লিখেছেন।";
    },

    edit_review: (activity: any) => {
        return activity.book_title + " এর রিভিউ আপডেট করেছেন।";
    },

    delete_review: (activity: any) => {
        return activity.book_title + " এর রিভিউ ডিলিট করেছেন।";
    },

    block_user: (activity: any) => {
        return `${activity.profile_first_name} ${activity.profile_last_name} কে ব্লক করেছেন।`;
    },

    unblock_user: (activity: any) => {
        return `${activity.profile_first_name} ${activity.profile_last_name} কে আনব্লক করেছেন।`;
    },

    follow: (activity: any) => {
        return `${activity.profile_first_name} ${activity.profile_last_name} কে ফলো করছেন।`;
    },

    unfollow: (activity: any) => {
        return `${activity.profile_first_name} ${activity.profile_last_name} কে আনফলো করেছেন।`;
    },

    update_profile: (activity: any) => {
        const fields = Object.keys(activity).includes('field') && activity.field && activity.field !== ''
            ? JSON.parse(activity.field)
            : [""];
        return `আপনার ${fields.join(', ')} আপডেট করেছেন।`;
    },
}

export const formatActivity = (activity: any) => {
    const handler = activityHandlers[activity.type];
    return handler ? handler(activity) : 'অজানা অ্যাক্টিভিটি';
};

export const icons: {[key: string]: React.ReactNode} = {
    book_details: <Entypo name="open-book" size={20} color="black" />,

    create_book: <Entypo name="open-book" size={20} color="black" />,

    update_book: <Entypo name="open-book" size={20} color="black" />,

    delete_book: <Entypo name="open-book" size={20} color="black" />,

    update_book_permission: <Entypo name="open-book" size={20} color="black" />,

    library_book_added: <Ionicons name="bookmark-sharp" size={20} color="black" />,

    library_book_remove: <Ionicons name="bookmark-outline" size={20} color="black" />,

    create_review: <Image source={require('@/assets/images/book_review_icon.png')} style={{width: 20, height: 20}} />,

    edit_review: <Image source={require('@/assets/images/book_review_icon.png')} style={{width: 20, height: 20}} />,

    delete_review: <Image source={require('@/assets/images/book_review_icon.png')} style={{width: 20, height: 20}} />,

    block_user: <FontAwesome name="user-times" size={20} color="black" />,

    unblock_user: <FontAwesome name="user" size={20} color="black" />,

    follow: <FontAwesome name="user-plus" size={20} color="black" />,

    unfollow: <FontAwesome name="user-times" size={20} color="black" />,

    update_profile: <FontAwesome5 name="user-edit" size={20} color="black" />,
}