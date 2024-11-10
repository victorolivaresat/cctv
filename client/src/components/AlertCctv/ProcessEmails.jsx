import { ProgressBar, Alert, Spinner } from "react-bootstrap";
import { processEmailsCctv } from "../../api/alertCctv";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";

const ProcessEmails = () => {
  const [processedEmails, setProcessedEmails] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalEmails, setTotalEmails] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const processEmails = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      await processEmailsCctv();
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al procesar los correos");
    } finally {
      setIsLoading(false);
    }
  }, [isProcessing]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("emailProcessed", () => {
      setProcessedEmails((prev) => prev + 1);
    });

    socket.on("totalEmailsToProcess", (data) => {
      if (data.total === 0) {
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      setTotalEmails(data.total);
    });

    socket.on("allEmailsProcessed", () => {
      setIsLoading(false);
      setIsProcessing(false);
      setTotalEmails(0);
      setProcessedEmails(0);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    });

    const intervalId = setInterval(processEmails, 10000);

    return () => {
      socket.disconnect();
      clearInterval(intervalId);
    };
  }, [processEmails]);

  return (
    <>
      {isLoading && (
        <div className="d-grid gap-2">
          <span className="my-3 mx-3">
            <div className="small text-center">
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Procesando emails cctv...
            </div>
          </span>
        </div>
      )}
      {isLoading && (
        <ProgressBar
          now={(processedEmails / totalEmails) * 100}
          label={`${Math.round((processedEmails / totalEmails) * 100)}%`}
          striped
          animated
          variant="success"
          className="mx-3"
        />
      )}
      {showAlert && (
        <Alert className="border-0 shadow-sm mx-3" variant="success">
          Proceso de correos finalizado
        </Alert>
      )}
    </>
  );
};

export default ProcessEmails;
