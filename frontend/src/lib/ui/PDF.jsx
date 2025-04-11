import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
    page: {
        display: "flex",
        justifyContent: "start",
        width: "100%",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 60
    },
    logo: {
        width: "180px",
        height: "60px",
        img: {
            width: "100%",
            height: "100%",
        },
    },
    sectionInsights: {
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "column"
    }
});

// Create Document Component
const MyDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.logo}>
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/2560px-Oracle_logo.svg.png"
                    style={styles.img}
                />
            </View>
            <View style={styles.sectionInsights}>
                <Text style={{ fontSize: 24, marginBottom: 20 }}>Insights</Text>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.
                </Text>
                <Text style={{ fontSize: 16 }}>
                    Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.
                </Text>
            </View>
            <View style={styles.sectionInsights}>
                <Text style={{ fontSize: 24, marginBottom: 20 }}>Opportunities</Text>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.
                </Text>
                <Text style={{ fontSize: 16 }}>
                    Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.
                </Text>
            </View>
            <View style={styles.sectionInsights}>
                <Text style={{ fontSize: 24, marginBottom: 20 }}>Overall</Text>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.
                </Text>
                <Text style={{ fontSize: 16 }}>
                    Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.
                </Text>
            </View>
        </Page>
    </Document>
);

export const PDF = MyDocument;