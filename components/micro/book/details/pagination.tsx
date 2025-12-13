import { ScrollView, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import englishNumberToBengali from "@/app/utils/englishNumberToBengali";
import { useFocusEffect } from "expo-router";

const ITEM_WIDTH = 45; // width of each page button (must match your styling)

const Pagination = ({currentPage, data, onChange}: {currentPage: number; data: any; onChange: (value: number) => void;}) => {
  const [page, setPage] = useState(currentPage);
  const scrollRef = useRef<ScrollView>(null);

  const pages = Array.from({ length: data.total_pages }, (_, i) => i + 1);

  useFocusEffect(useCallback(() => setPage(currentPage), [currentPage]))

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
        <TouchableOpacity style={styles.button} onPress={() => onPageChange(page - 1)} disabled={page === 1}>
          <Text style={styles.buttonText}>{"<"}</Text>
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
            <TouchableOpacity
              key={p}
              style={page === p ? styles.activeButton : styles.button}
              onPress={() => onPageChange(p)}
            >
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
        <TouchableOpacity style={styles.button} onPress={() => onPageChange(page + 1)} disabled={page === data.total_pages}>
          <Text style={styles.buttonText}>{">"}</Text>
        </TouchableOpacity>

        {/* Last page */}
        <TouchableOpacity style={[styles.button, { backgroundColor: "#444E60" }]} onPress={() => onPageChange(data.total_pages)}>
          <Text style={[styles.buttonText, { color: "white" }]}>
            {englishNumberToBengali(data.total_pages)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Pagination

const styles = StyleSheet.create({
    button: {
        height: 35,
        width: 35,
        padding: 5,
        marginHorizontal: 3,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: 'lightgray'
    },
    buttonText: {
        width: '100%',
        textAlign: 'center',
    },
    activeButton: {
        height: 35,
        width: 35,
        padding: 5,
        marginHorizontal: 5,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: 'lightgray',
        backgroundColor: '#2A74F2',
    },
    activeButtonText: {
        width: '100%',
        textAlign: 'center',
        color: 'white',
    },
})