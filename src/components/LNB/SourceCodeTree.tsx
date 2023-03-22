import * as React from 'react';
import FolderTree from 'react-folder-tree';
import WorkspaceStore from '../../stores/workspaceStore';
import { Observer } from 'mobx-react';
import { sendMessage } from '../../utils/service-utils';
import 'react-folder-tree/dist/style.css';
import EditorContentsStore from '../../stores/editorContentsStore';
import {
  NoteAdd,
  CreateNewFolder,
  Close,
  Delete,
  Edit,
  Folder,
  FolderOpen,
  InsertDriveFile,
} from '@mui/icons-material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export const SourceCodeTree: React.FC = () => {
  const onSourceCodeLinkClick = ({ nodeData }) => {
    const { isFile, srcId, newfile, srcPath, content, edited } = nodeData;
    if (isFile) {
      if (newfile || edited) {
        EditorContentsStore.updateContentAction(srcPath, content);
      } else {
        sendMessage('source', 'DetailService', {
          src_id: srcId,
          commit_id: WorkspaceStore.currentCommit.commitId,
        });
      }
    }
  };
  const resultJson = {
    name: WorkspaceStore.currentReference.name,
    children: [],
  };
  const pathToJson = (sourceCodeList) => {
    sourceCodeList.forEach((src) => {
      let node = resultJson;
      const srcId = src.srcId;
      const nodeArray = src.srcPath.split('/');
      let nodeTotalPath: string = '';
      nodeArray.forEach((nodePath, index) => {
        if (!node.children) {
          node.children = [];
        }
        nodeTotalPath += nodePath;
        nodeTotalPath += '/';
        let nameArray: Array<String> = node.children.map((child) => child.name);
        if (!nameArray.includes(nodePath)) {
          if (index === nodeArray.length - 1)
            node.children.push({
              name: nodePath,
              srcId: srcId,
              isFile: true,
              newfile: src.newfile,
              srcPath: src.srcPath,
              content: src.content,
              edited: src.edited,
            });
          else
            node.children.push({
              name: nodePath,
              nodePath: nodeTotalPath,
            });
        }
        node = node.children.filter(
          (pathList) => pathList.name === nodePath,
        )[0];
      });
    });
    return resultJson;
  };

  const AddFileIcon = ({ nodeData }) => {
    const { nodePath } = nodeData;

    // custom event handler
    const handleClick = () => {
      handleOpenModal(nodePath);
      // defaultOnClick();
    };

    // custom Style
    return <NoteAdd fontSize="small" onClick={handleClick} />;
  };

  const AddFolderIcon = ({ onClick: defaultOnClick, nodeData }) => {
    const { nodePath } = nodeData;

    // custom event handler
    const handleClick = () => {
      defaultOnClick();
    };

    // custom Style
    return <CreateNewFolder fontSize="small" onClick={handleClick} />;
  };

  const CancelIcon = ({ onClick: defaultOnClick }) => {
    const handleClick = () => {
      defaultOnClick();
    };
    return <Close fontSize="small" onClick={handleClick} />;
  };

  const DeleteIcon = ({ onClick: defaultOnClick }) => {
    const handleClick = () => {
      defaultOnClick();
    };
    return <Delete fontSize="small" onClick={handleClick} />;
  };

  const EditIcon = ({ onClick: defaultOnClick }) => {
    const handleClick = () => {
      defaultOnClick();
    };
    return <Edit fontSize="small" onClick={handleClick} />;
  };

  const FolderIcon = ({ onClick: defaultOnClick }) => {
    const handleClick = () => {
      defaultOnClick();
    };
    return <Folder fontSize="small" onClick={handleClick} />;
  };

  const FolderOpenIcon = ({ onClick: defaultOnClick }) => {
    const handleClick = () => {
      defaultOnClick();
    };
    return <FolderOpen fontSize="small" onClick={handleClick} />;
  };

  const FileIcon = ({ onClick: defaultOnClick }) => {
    const handleClick = () => {
      defaultOnClick();
    };
    return <InsertDriveFile fontSize="small" onClick={handleClick} />;
  };

  const [showModal, setShowModal] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [pathValue, setPathValue] = React.useState('');
  const handleOpenModal = (NodePath) => {
    setShowModal(true);
    setPathValue(NodePath)
  };

  const handleCreateModal = () => {
    const newFilePath = pathValue + inputValue;
      WorkspaceStore.addNewSourceCodeAction({
        srcPath: newFilePath,
        newfile: true, 
      });
      EditorContentsStore.updateContentAction(newFilePath, '');
    setShowModal(false);
    setInputValue('');
  };
  const handleCancelModal = () => {
    setShowModal(false);
    setInputValue('');
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <Observer>
      {() => (
        <div>
        <div className="source-code-tree">
          <FolderTree
            data={pathToJson(WorkspaceStore.sourceCodeList)}
            showCheckbox={false}
            indentPixels={5}
            onNameClick={onSourceCodeLinkClick}
            iconComponents={{
              AddFileIcon,
              AddFolderIcon,
              CancelIcon,
              DeleteIcon,
              EditIcon,
              FolderIcon,
              FolderOpenIcon,
              FileIcon,
            }}
          />
        </div>
        <div>
        <Dialog open={showModal} onClose={handleCancelModal}>
          <DialogTitle> File name</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter a file name</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="file name"
              type="email"
              fullWidth
              variant="standard"
              value={inputValue}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelModal}>Cancel</Button>
            <Button onClick={handleCreateModal}>Create</Button>
          </DialogActions>
        </Dialog>
      </div>
      </div>
      )}
    </Observer>
  );
};
