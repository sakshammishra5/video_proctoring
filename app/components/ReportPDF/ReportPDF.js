// app/components/ReportPDF.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 15 },
  heading: { fontSize: 14, marginBottom: 5, fontWeight: 'bold' },
  log: { fontSize: 10, marginBottom: 3 },
});

export default function ReportPDF({ candidateName, roomId, duration, integrityScore, logs }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Proctoring Report</Text>

        <View style={styles.section}>
          <Text>Candidate: {candidateName}</Text>
          <Text>Room ID: {roomId}</Text>
          <Text>Duration: {duration}</Text>
          <Text>Integrity Score: {integrityScore}/100</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Event Logs</Text>
          {logs.map((log, i) => (
            <Text key={i} style={styles.log}>
              {new Date(log.timestamp).toLocaleTimeString()} — [{log.type}] {log.message}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
