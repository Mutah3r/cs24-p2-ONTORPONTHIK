import { formatTimeToHumanReadable } from './timeUtils';

export const createAndDownloadPDF = async (log) => {
        try {
                // Create a new PDF document
                const pdfDoc = await PDFLib.PDFDocument.create();
          
                // Add a new page to the document
                const page = pdfDoc.addPage([350, 200]);
          
                // Add some text to the page
                const helveticaFont = await pdfDoc.embedFont(
                  PDFLib.StandardFonts.Helvetica
                );
                const textSize = 24;
          
                page.drawText("EcoSync", {
                  x: 3,
                  y: page.getHeight() - 10,
                  size: 10,
                  font: helveticaFont,
                });
          
                page.drawText("Billing Slip", {
                  x: 120,
                  y: page.getHeight() - 45,
                  size: textSize,
                  font: helveticaFont,
                });
          
                page.drawText(`Vehicle Number : ${log.vehicle_registration}`, {
                  x: 10,
                  y: page.getHeight() - 70,
                  size: 11,
                  font: helveticaFont,
                });
          
                page.drawText(`Truck details: ${log.track_details}`, {
                  x: 10,
                  y: page.getHeight() - 90,
                  size: 11,
                  font: helveticaFont,
                });
          
                page.drawText(
                  `Time of arrival: ${formatTimeToHumanReadable(log.time_of_arrival)}`,
                  {
                    x: 10,
                    y: page.getHeight() - 110,
                    size: 11,
                    font: helveticaFont,
                  }
                );
          
                page.drawText(
                  `Time of departure: ${formatTimeToHumanReadable(
                    log.time_of_departure
                  )}`,
                  {
                    x: 10,
                    y: page.getHeight() - 130,
                    size: 11,
                    font: helveticaFont,
                  }
                );
          
                page.drawText(`Weight of waste: ${log.weight_of_waste}`, {
                  x: 10,
                  y: page.getHeight() - 150,
                  size: 11,
                  font: helveticaFont,
                });
          
                page.drawText(`Cost per kilometer: ${log.cost_per_km} BDT`, {
                  x: 10,
                  y: page.getHeight() - 170,
                  size: 11,
                  font: helveticaFont,
                });
          
                // Serialize the PDF document to bytes
                const pdfBytes = await pdfDoc.save();
          
                // Convert bytes to Blob
                const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
          
                // Create a temporary URL for the blob
                const url = window.URL.createObjectURL(pdfBlob);
          
                // Create a link element to trigger the download
                const link = document.createElement("a");
                link.href = url;
                link.download = "billing slip.pdf";
          
                // Append the link to the body and trigger the download
                document.body.appendChild(link);
                link.click();
          
                // Clean up by revoking the URL object
                window.URL.revokeObjectURL(url);
        } catch (error) {
                console.error("Error creating and downloading PDF:", error);
        }
};
