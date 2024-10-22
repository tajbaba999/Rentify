// import { UserButton } from "@clerk/nextjs";
import React from "react";

const Account = () => {
  return (
    <div className="pl-52">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl text-neutral-200 mb-4">Account Settings</h1>
        <p className="text-lg text-neutral-400 text-center max-w-lg">
          For account setting, see at the top right corner. Here you can manage
          your account settings, including updating your profile information,
          changing your password, and setting preferences. For assistance, refer
          to the help section or contact support. Make sure to save any changes
          you make before navigating away from this page.
        </p>
      </div>
    </div>
  );
};

export default Account;
