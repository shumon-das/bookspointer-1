import { View, StyleSheet, TouchableOpacity, Text } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";
import englishNumberToBengali from "@/app/utils/englishNumberToBengali";

const Pagination = ({currentPage, data, onChange}: {currentPage: number, data: any, onChange: (value: number) => void}) => {
    const [page, setPage] = useState(currentPage)
    // How many page buttons to show
    const windowSize = 5;

    // Calculate the start & end page
    const half = Math.floor(windowSize / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(data.total_pages, page + half);

    // Adjust if near boundaries
    if (end - start + 1 < windowSize) {
    if (start === 1) {
        end = Math.min(data.total_pages, start + windowSize - 1);
    } else if (end === data.total_pages) {
        start = Math.max(1, end - windowSize + 1);
    }
    }

    // Generate array of pages to display
    const pagesToShow = [];
        for (let i = start; i <= end; i++) {
        pagesToShow.push(i);
    }

    const onPageChange = (changedPageNumber: number) => {
        setPage(changedPageNumber)
        onChange(changedPageNumber)
    }

    return (<View style={{ flexDirection: "row", justifyContent: 'center', alignContent: 'center', marginTop: 5, height: 60 }}>
        <TouchableOpacity style={styles.button} onPress={() => onPageChange(page - 1)} disabled={page === 1}>
            <Text style={styles.buttonText}><AntDesign name="left" size={15} color="black" /></Text>
        </TouchableOpacity>

        {pagesToShow.map((pageNumber) => (
            <TouchableOpacity style={page === pageNumber ? styles.activeButton : styles.button} key={pageNumber} onPress={() => onPageChange(pageNumber)} disabled={page === pageNumber}>
                <Text style={page === pageNumber ? styles.activeButtonText : styles.buttonText}>{String(englishNumberToBengali(pageNumber))}</Text>
            </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.button} onPress={() => onPageChange(page + 1)} disabled={page === data.total_pages}>
            <Text style={styles.buttonText}><AntDesign name="right" size={15} color="black" /></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button,{borderRadius: 5, backgroundColor: '#444E60'}]} onPress={() => onPageChange(page + 1)} disabled={page === data.total_pages}>
            <Text style={[styles.buttonText, {color: 'white'}]}>{englishNumberToBengali(data.total_pages)}</Text>
        </TouchableOpacity>
     </View>)
}

export default Pagination

const styles = StyleSheet.create({
    button: {
        height: 40,
        width: 40,
        padding: 10,
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
        height: 40,
        width: 40,
        padding: 10,
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