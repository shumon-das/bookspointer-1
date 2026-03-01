import React, { useEffect, useLayoutEffect } from "react";
import { View, SafeAreaView, KeyboardAvoidingView, Image } from "react-native";
import { useNavigation, useRouter } from 'expo-router'
import { 
  RichText, 
  Toolbar,
  useEditorBridge, 
  TenTapStartKit, 
  PlaceholderBridge, 
  LinkBridge, 
  ColorBridge,
  ImageBridge,
  DEFAULT_TOOLBAR_ITEMS,
  CoreBridge,
  ToolbarItem,
  useEditorContent,
  defaultEditorTheme
} from "@10play/tentap-editor";
import { InsertImageButton } from "@/app/utils/editor/toolbarItem";
import ColorBar from "@/components/editor/ColorBar";
import labels from "@/app/utils/labels";
import { useTempStore } from "@/app/store/temporaryStore";

interface Props {
  initialContent?: string;
  onChange: (html: string) => void;
}

const darkEditorCss = `
  .ProseMirror {
    line-height: 1.2;
    padding-left: 10px;
    padding-right: 10px;
  }

  .ProseMirror p {
    margin-top: 2px;
    margin-bottom: 2px;
  }
`;

const COLORS = ['#ff0000', '#00ff00', '#0000ff'];

const WriteScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => { navigation.setOptions({ headerShown: true, title: labels.writeBook });}, []);
  const initialContent = useTempStore.getState().bookContent

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: initialContent,
    theme: {
      ...defaultEditorTheme,
      toolbar: {
        toolbarBody: {
          backgroundColor: '#474747',
          paddingVertical: 2
        },
        toolbarButton: {
          backgroundColor: '#474747',
          borderColor: 'gray',
          borderWidth: 1,
          borderRadius: 5,
          marginRight: 5
        },
        icon: {
          tintColor: 'white',
          backgroundColor: '#474747',

        }
      }
    },
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(darkEditorCss),
      LinkBridge.configureExtension({ openOnClick: false }),
      ColorBridge.configureExtension({ colors: COLORS }),
      ImageBridge.configureExtension({ 
        onUpload: async () => 'https://example.com/image.jpg'
      }),
      PlaceholderBridge.configureExtension({
        placeholder: labels.startWriting,
      }),
    ],
  });

  const [toggleColorButton, setToggleColorButton] = React.useState(false);
  const InsertColorButton: ToolbarItem = {
    onPress: ({ editor }) => () => setToggleColorButton(!toggleColorButton),
    active: () => false,
    disabled: () => false,
    image: () => {
      const img = Image.resolveAssetSource(require('../../../assets/images/font-color.png'));
      return { uri: img.uri }
    }
  };

  const content = useEditorContent(editor, { type: 'html' });
  useEffect(() => {
    if (!content) return;
    useTempStore.getState().setBookContent(content)
  }, [content])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RichText editor={editor} />
      
      <KeyboardAvoidingView behavior={'padding'} style={{ position: 'absolute', width: '100%', bottom: 0 }}>
        <View style={{backgroundColor: 'gray'}}>
          {toggleColorButton && <ColorBar editor={editor} colors={COLORS} />}
          <Toolbar editor={editor} items={[
            InsertImageButton,
            InsertColorButton,
            ...DEFAULT_TOOLBAR_ITEMS,
          ]}/>
        </View>
        <View style={{height: 88}}></View>
      </KeyboardAvoidingView>
      <View style={{height: 100, backgroundColor: 'white'}}></View>
    </SafeAreaView>
  );
};

export default WriteScreen;
