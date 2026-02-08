import { IconHome } from "@tabler/icons-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import "./MissingObject.css";

const BASE_URL = "missing-object";

function MissingObject() {
  const navigate = useNavigate();
  return (
    <div className={`${BASE_URL}`}>
      <div className={`${BASE_URL}__content`}>
        <h1 className={`${BASE_URL}__title`}>Something went wrong!</h1>
        <p className={`${BASE_URL}__message`}>
          Unfortunately what you are looking for couldn't be found.
        </p>
        <Button
          variant="default"
          leftSection={<IconHome />}
          onClick={() => navigate("/home")}
        >
          Go home
        </Button>
      </div>
    </div>
  );
}

export default MissingObject;
