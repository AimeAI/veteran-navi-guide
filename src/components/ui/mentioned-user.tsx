
import React from "react";
import { Link } from "react-router-dom";
import { MentionedUser } from "@/utils/mentionUtils";

interface MentionedUserProps {
  user: MentionedUser;
}

const MentionedUser: React.FC<MentionedUserProps> = ({ user }) => {
  return (
    <Link 
      to={`/user-profile/${user.username}`}
      className="inline-flex items-center font-medium text-primary hover:underline"
    >
      @{user.username}
    </Link>
  );
};

export default MentionedUser;
