import { Badge, Button } from "@/components/ui";
import { IconMail } from "@tabler/icons-react";
import "./CloudSyncSignIn.css";

const BASE = "cloud-sync-sign-in";

interface CloudSyncSignInProps {
  onSignIn: () => void;
}

export default function CloudSyncSignIn({ onSignIn }: CloudSyncSignInProps) {
  return (
    <div className={BASE}>
      <Badge variant="filled" color="neutral">
        Beta
      </Badge>
      <h1>Skola Cloud Sync</h1>
      <p>Limits and conditions apply. See below for more information.</p>
      <Button
        variant="white"
        size="md"
        onClick={onSignIn}
        leftSection={<IconMail />}
      >
        Sign In
      </Button>
    </div>
  );
}
