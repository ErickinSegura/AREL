import React from "react";
import { Button } from "../lib/ui/Button";
import { PDF } from "../lib/ui/PDF";
import {PDFDownloadLink} from "@react-pdf/renderer"

const Shortcuts = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shortcuts</h1>
      <p>Contenido de la vista Shortcuts</p>
      <PDFDownloadLink document={<PDF />} fileName="report.pdf">
        <Button variant="remarked" color="error">
            Save as PDF
        </Button>
      </PDFDownloadLink>
    </div>
  );
};

export default Shortcuts;
