import axios from "axios";
import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa6";

const Billing = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [landfillLogs, setLandfillLogs] = useState(null);
  const [filteredLandfillLogs, setFilteredLandfillLogs] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/profile?token=${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/billing/billslip/${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((res) => {
        console.log("landfill Logs:");
        console.log(res.data.data);

        setLandfillLogs(res.data.data);
        setFilteredLandfillLogs(res.data.data);
        setLoading(false);
        setLogsLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const formatTimeToHumanReadable = (timeString) => {
    const date = new Date(timeString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    return date.toLocaleDateString(undefined, options);
  };

  async function createAndDownloadPDF(log) {
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
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Billing</h1>

      {user && user.role === "Landfill manager" && (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Landfill Name</th>
                <th>Vehicle Reg. No.</th>
                <th>Carried Waste</th>
                <th>Cost Per KM</th>
                <th>Time of Departure</th>
                <th>Time of Arrival</th>
                <th>Destination Landfill</th>
                <th>Download Bill</th>
              </tr>
            </thead>
            <tbody>
              {filteredLandfillLogs &&
                filteredLandfillLogs.map((log, idx) => (
                  <tr key={log._id}>
                    <th>{idx + 1}</th>
                    <td>{log.name}</td>
                    <td>{log.vehicle_registration}</td>
                    <td>{log.weight_of_waste + " ton"}</td>
                    <td>{log.cost_per_km + " BDT"}</td>
                    <td>{formatTimeToHumanReadable(log.time_of_departure)}</td>
                    <td>{formatTimeToHumanReadable(log.time_of_arrival)}</td>
                    <td>{log.from}</td>
                    <td className="flex justify-center">
                      <FaDownload
                        onClick={() => createAndDownloadPDF(log)}
                        className="cursor-pointer text-[20px]"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Billing;
