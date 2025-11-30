
import { useAuthStore } from '@/app/store/auth';
import labels from '@/app/utils/labels';
import PopOver from '@/components/micro/PopOver';
import { UserInterface } from '@/types/interfeces';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const HeaderRightPopover = ({user}: {user: UserInterface}) => {
  const router = useRouter();
  const popoverIcon = <Feather name="settings" size={18} color="#d4d4d4" />
  const popoverMenus = [
    {index: 1, label: labels.user.update.name},
    {index: 2, label: labels.user.update.email},
    {index: 3, label: labels.user.update.updatePassword},
    {index: 4, label: labels.user.update.description},
    {index: 5, label: labels.user.update.socials},
    {index: 6, label: labels.signOut},
  ];
  const popoverAction = (item: any) => { 
    if (1 === item.item.index) {
      console.log(user)
    }
    if (2 === item.item.index) {
      // router.push({pathname: "/screens/book/write-book", params: { bookuuid: book.uuid, }});
    }
    if (3 === item.item.index) {
      router.push({pathname: "/screens/user/resetPassword", params: {  }});
    }
    if (4 === item.item.index) {
      // router.push({pathname: "/screens/book/write-book", params: { bookuuid: book.uuid, }});
    }
    if (5 === item.item.index) {
      // router.push({pathname: "/screens/book/write-book", params: { bookuuid: book.uuid, }});
    }
    if (6 === item.item.index) {
      logout();
    }
  }

  const logout = async () => {
    await AsyncStorage.multiRemove(['auth-user', 'auth-token']);
    useAuthStore.getState().setUser(null);
    router.push("/");
  }

  return (<PopOver icon={popoverIcon} menus={popoverMenus} action={popoverAction} />)
}

export default HeaderRightPopover;