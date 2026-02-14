import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import englishNumberToBengali from "@/app/utils/englishNumberToBengali";
import { useFocusEffect } from "expo-router";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { styles } from "@/styles/pagination.styles";

const ITEM_WIDTH = 45; // width of each page button (must match your styling)

const Pagination = ({currentPage, data, onChange}: {currentPage: number; data: any; onChange: (value: number) => void;}) => {
  const [page, setPage] = useState(currentPage);
  const scrollRef = useRef<ScrollView>(null);

  const pages = Array.from({ length: data.total_pages }, (_, i) => i + 1);

  useFocusEffect(
    useCallback(() => {
      setPage(currentPage);
    }, [currentPage])
  )

  const onPageChange = (changedPageNumber: number) => {
    setPage(changedPageNumber);
    onChange(changedPageNumber);
  };

  // 🔥 Auto-scroll to keep active page centered
  useEffect(() => {
    const index = page - 1; // 0-based index
    const xOffset = index * ITEM_WIDTH - 150; // center offset

    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: Math.max(0, xOffset),
        animated: true,
      });
    }
  }, [page]);

  return (
    <View>
      <View style={{flexDirection: "row",justifyContent: "center",marginTop: 0,height: 60,alignItems: "flex-start"}}>
        {/* Last page */}
        <TouchableOpacity style={[styles.totalPages, { marginVertical: 2, marginHorizontal: 1, }]} onPress={() => onPageChange(page)}>
          <Text style={[styles.totalTexts, {borderBottomWidth: 1, borderColor: 'lightgray'}]}>
            {englishNumberToBengali(page)}
          </Text>
          <Text style={[styles.totalTexts]}>
            {englishNumberToBengali(data.total_pages)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.prevButton} onPress={() => onPageChange(page - 1)} disabled={page === 1}>
          <Text style={styles.nxtPrevbuttonText}><FontAwesome5 name="angle-double-left" size={20} color="gray" /></Text>
        </TouchableOpacity>

        {/* Scrollable page list */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}
          contentContainerStyle={{ flexDirection: "row" }}
          style={{ maxWidth: "65%" }}
        >
          {pages.map((p) => (
            <TouchableOpacity key={p} style={page === p ? styles.activeButton : styles.button} onPress={() => onPageChange(p)}>
              <Text
                style={
                  page === p
                    ? styles.activeButtonText
                    : styles.buttonText
                }
              >
                {englishNumberToBengali(p)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Next */}
        <TouchableOpacity style={styles.nextButton} onPress={() => onPageChange(page + 1)} disabled={page === data.total_pages}>
          <Text style={styles.nxtPrevbuttonText}><FontAwesome5 name="angle-double-right" size={20} color="gray" /></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Pagination
