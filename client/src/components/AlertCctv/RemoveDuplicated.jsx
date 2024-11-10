import { removeDuplicateTestHv } from "../../api/tests";
import { Button, Spinner, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const RemoveDuplicated = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

  const removeDuplicated = async () => {
    try {
      const data = await removeDuplicateTestHv();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("totalDuplicates", (data) => {
      if (data.total === 0) {
        return;
      }

      setIsLoading(true);
      console.log(`Total duplicados: ${data.total}`);
    });

    socket.on("allDuplicatesRemoved", () => {
      setIsLoading(false);
      setShowMsg(true);
      setTimeout(() => {
        setShowMsg(false);
      }, 5000);
    });
  }, []);

  return (
    <>
      <div className="d-grid gap-2">
        <Button
          className="my-3 mx-2"
          onClick={removeDuplicated}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Eliminando...
            </>
          ) : (
            "Remove duplicated"
          )}
        </Button>
      </div>
      {showMsg && (
        <Alert variant="primary" className="border-0 shadow-sm">
        <p>
          Duplicados eliminados correctamente
        </p>
      </Alert>
      )}
    </>
  );
};

export default RemoveDuplicated;
