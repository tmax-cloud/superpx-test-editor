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

export default function CreateTemplate() {
  const { t } = useTranslation();
  // const [buildSystem, setBuildSystem] = React.useState('');
  const [group, setGroup] = React.useState('');
  const [version, setVersion] = React.useState('');
  const [jdk, setJdk] = React.useState('');
  const [isImport, setIsImport] = React.useState(false);
  const [projectName, setProjectName] = React.useState('');
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

  return (
    <div className="project-page-parent">
      <div className="create-page-blank-head">
        <h1>{t('CREATENEWPROJECT')}</h1>
        <Button
          variant="contained"
          onClick={() => {
            sendMessage('project', 'GenerateService', {
              project: {
                build_system: 'maven',
                name: projectName,
                group: group,
                version: version,
                jdk: jdk,
                is_import: isImport,
              },
            });
            navigate(`/px/projects/${projectName}`);
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
        <h3>Group *</h3>
        <TextField
          helperText={'Enter Build Group'}
          id={'demo-helper-text-aligned'}
          label={'Enter Build Group'}
          value={group}
          onChange={(event) => {
            setGroup(event.target.value);
          }}
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
        <TextField
          helperText={'Enter JDK'}
          id={'demo-helper-text-aligned'}
          label={'Enter JDK'}
          value={jdk}
          onChange={(event) => {
            setJdk(event.target.value);
          }}
        />
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
