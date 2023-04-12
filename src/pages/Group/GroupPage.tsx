import * as React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const tempGroups = [
  { groupName: 'ck1-1', member: ['Kim', 'Lee', 'Park'] },
  { groupName: 'ck1-2', member: ['Choi', 'Son', 'Joo'] },
];

const GroupPage: React.FC = () => {
  return (
    <div>
      {tempGroups.map((group) => (
        <div>
          <Link
            key={`group-${group.groupName}`}
            to={`/px/groups/${group.groupName}`}
          >
            <Button>{group.groupName}</Button>
          </Link>

          {group.member.map((m) => (
            <div>{` - ${m}`}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GroupPage;
