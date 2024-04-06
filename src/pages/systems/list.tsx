import { UserRole } from "../../enums/user.enum";
import { useIdentity } from "../../hooks/useIdentity";
import BlockedWords from "./components/BlockedWords";
import GuestResources from "./components/GuestResources";
import SystemConfigs from "./components/SystemConfigs";

const SystemsManagement = () => {
  const { role } = useIdentity();

  return (
    <>
      <BlockedWords />
      {role === UserRole.COORDINATOR && <GuestResources />}
      {role === UserRole.ADMIN && <SystemConfigs />}
    </>
  );
};

export default SystemsManagement;
