import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { sendMessage } from '../../utils/service-utils';
import { useNavigate } from 'react-router-dom';
import loadingStore from '../../stores/loadingStore';
import { DuplicationButton } from './CreateBlank';
import WorkspaceStore from '../../stores/workspaceStore';

export default function CreateTemplate() {
  const { t } = useTranslation();
  // const [buildSystem, setBuildSystem] = React.useState('');
  const [group, setGroup] = React.useState('');
  const [version, setVersion] = React.useState('');
  const [jdk, setJdk] = React.useState('1.8');
  const [isImport, setIsImport] = React.useState(true);
  const [projectName, setProjectName] = React.useState('');
  const [duplicateState, setDuplicateState] = React.useState('ready');
  const [invalidProjectNameHelp, setinValidProjectNameHelp] =
    React.useState('');
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
  const navigate = useNavigate();
  React.useEffect(() => {
    if (WorkspaceStore.projectList.length && duplicateState === 'loading') {
      const isDuplicate = WorkspaceStore.projectList.some(
        (pj) => pj.name === projectName,
      );
      setDuplicateState(isDuplicate ? 'error' : 'success');
    }
  }, [WorkspaceStore.projectList, duplicateState]);
  return (
    <div className="project-page-parent">
      <div className="create-page-blank-head">
        <h1>{t('CREATENEWPROJECT')}</h1>
        <Button
          disabled={!!invalidProjectNameHelp}
          variant="contained"
          onClick={() => {
            sendMessage('project', 'GenerateService', {
              project: {
                build_system: 'maven',
                name: projectName,
                group: group ? group : 'com.tmax',
                version: version ? version : 'main',
                jdk: jdk ? jdk : '11',
                is_import: isImport,
              },
            });
            navigate(`/projects/${projectName}`);
            loadingStore.setLoading(true);
          }}
        >
          Create project
        </Button>
      </div>
      <div className="create-page-blank">
        <h3>Project Name *</h3>
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
        <h3>Build System *</h3>
        <TextField
          helperText={'Enter Build System'}
          id={'demo-helper-text-aligned'}
          label={'Enter Build System'}
          defaultValue={'maven'}
          InputProps={{
            readOnly: true,
          }}
          // onChange={(event) => {
          //   setBuildSystem(event.target.value);
          // }}
        />
      </div>
      <div className="create-page-blank">
        <div>
          <h3>Group</h3>
          <h5>(optional)</h5>
        </div>
        <TextField
          helperText={'Enter Build Group'}
          id={'demo-helper-text-aligned'}
          value={group}
          onChange={(event) => {
            setGroup(event.target.value);
          }}
          placeholder="com.tmax"
        />
      </div>
      <div className="create-page-blank">
        <div>
          <h3>Version</h3>
          <h5>(optional)</h5>
        </div>
        <TextField
          helperText={'Enter Version'}
          id={'demo-helper-text-aligned'}
          label={'Enter Version'}
          value={version}
          onChange={(event) => {
            setVersion(event.target.value);
          }}
        />
      </div>
      <div className="create-page-blank">
        <div>
          <h3>JDK</h3>
          <h5>(optional)</h5>
        </div>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={jdk}
            onChange={(event) => {
              setJdk(event.target.value);
            }}
          >
            <FormControlLabel value={'1.8'} control={<Radio />} label="1.8" />
            <FormControlLabel value={'11'} control={<Radio />} label="11" />
          </RadioGroup>
        </FormControl>
      </div>
      <div className="create-page-blank">
        <div>
          <h3>Is import</h3>
          <h5>(optional)</h5>
        </div>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={isImport}
            onChange={(event) => {
              setIsImport(event.target.value === 'true');
            }}
            name="Is import"
          >
            <FormControlLabel value={false} control={<Radio />} label="false" />
            <FormControlLabel value={true} control={<Radio />} label="true" />
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
}
