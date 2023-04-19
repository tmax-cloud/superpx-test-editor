import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import HelpIcon from '@mui/icons-material/Help';
import { sendMessage } from '../../utils/service-utils';
import { useNavigate } from 'react-router-dom';
import loadingStore from '../../stores/loadingStore';
import WorkspaceStore from '../../stores/workspaceStore';

interface DuplicationButtonProps {
  btnType: string;
  setDuplicateState: (type: string) => void;
}
export const DuplicationButton: React.FC<DuplicationButtonProps> = ({
  btnType,
  setDuplicateState,
}) => {
  switch (btnType) {
    case 'ready':
      return (
        <Button
          onClick={() => {
            setDuplicateState('loading');
            sendMessage('project', 'ListService', {});
          }}
          color="secondary"
        >
          duplicate check
        </Button>
      );
    case 'loading':
      return (
        <Button color="primary" disabled={true}>
          <CircularProgress size={24} />
        </Button>
      );
    case 'success':
      return <Button color="success">Success</Button>;
    default:
      return <Button color="error">duplicate discovery</Button>;
  }
};

export default function CreateBlank() {
  const { t } = useTranslation();
  const [projectDescription, setProjectDescription] = React.useState('');
  const [projectName, setProjectName] = React.useState('');
  const [visibilityLevel, setVisibilityLevel] = React.useState('Public');
  const [characterCount, setCharacterCount] = React.useState(0);
  const [duplicateState, setDuplicateState] = React.useState('ready');

  const [invalidProjectNameHelp, setinValidProjectNameHelp] =
    React.useState('');
  const handleProjectDescriptionChange = (event) => {
    setProjectDescription(event.target.value);
    setCharacterCount(event.target.value.length);
  };
  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };
  React.useEffect(() => {
    if (!projectName) {
      setinValidProjectNameHelp('content is empty');
    } else if (!/^[^/\\:*?"<>|\s]+$/.test(projectName)) {
      setinValidProjectNameHelp('Must not contain ", /:?"<>|" characters');
    } else {
      setinValidProjectNameHelp('');
    }
  }, [projectName]);

  React.useEffect(() => {
    if (WorkspaceStore.projectList.length && duplicateState === 'loading') {
      const isDuplicate = WorkspaceStore.projectList.some(
        (pj) => pj.name === projectName,
      );
      setDuplicateState(isDuplicate ? 'error' : 'success');
    }
  }, [WorkspaceStore.projectList, duplicateState]);

  const handlevisibilityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setVisibilityLevel((event.target as HTMLInputElement).value);
  };
  const navigate = useNavigate();

  return (
    <div className="project-page-parent">
      <div className="create-page-blank-head">
        <h1>{t('CREATENEWPROJECT')}</h1>
        <Button
          disabled={!!invalidProjectNameHelp}
          variant="contained"
          onClick={() => {
            loadingStore.setLoading(true);
            sendMessage('project', 'InsertService', {
              project: {
                name: projectName,
                is_dependency: 0,
              },
              reference: {
                name: 'main',
                type: 0,
              },
            });
            navigate(`/projects/${projectName}`);
          }}
        >
          Create project
        </Button>
      </div>
      <div className="create-page-blank">
        <h3>Project Name</h3>
        <TextField
          helperText={
            invalidProjectNameHelp
              ? invalidProjectNameHelp
              : 'Project slug will be created automatically.'
          }
          id={
            invalidProjectNameHelp
              ? 'outlined-error'
              : 'demo-helper-text-aligned'
          }
          label={'My awesome project'}
          error={!!invalidProjectNameHelp}
          value={projectName}
          onChange={handleProjectNameChange}
        />
        <DuplicationButton
          btnType={duplicateState}
          setDuplicateState={setDuplicateState}
        />
      </div>

      <div className="create-page-blank">
        <div>
          <h3>Project Description</h3>
          <h5>(optional)</h5>
        </div>
        <Box
          sx={{
            width: '550px',
          }}
        >
          <TextField
            label="This project is awesome."
            multiline
            rows={4}
            value={projectDescription}
            onChange={handleProjectDescriptionChange}
            variant="outlined"
            fullWidth
          />
          <Box sx={{ textAlign: 'right', mt: 1 }}>
            <small>{characterCount} / 200</small>
          </Box>
        </Box>
      </div>
      <div className="create-page-blank">
        <div>
          <h3>Visibility Level</h3>
          <Tooltip title="More information">
            <IconButton>
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </div>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={visibilityLevel}
            onChange={handlevisibilityChange}
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="Public"
              control={<Radio />}
              label="Public"
            />
            <FormHelperText>
              The project can be cloned without any authentication.
            </FormHelperText>
            <FormControlLabel
              value="Internal"
              control={<Radio />}
              label="Internal"
            />
            <FormHelperText>
              The project can be cloned by any logged in user.
            </FormHelperText>
            <FormControlLabel
              value="Private"
              control={<Radio />}
              label="Private"
            />
            <FormHelperText>
              Project access must be granted explicitly for each user.
            </FormHelperText>
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
}
