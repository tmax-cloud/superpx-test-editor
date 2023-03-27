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
    isOpen: true,
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
          else if (index > 0){
          node.children.push({
            name: nodePath,
            nodePath: nodeTotalPath,
            isOpen: false,
          });
          node.isOpen = false;
        } 
          else
            node.children.push({
              name: nodePath,
              nodePath: nodeTotalPath,
              isOpen: false,
            });
        }
        node = node.children.filter(
          (pathList) => pathList.name === nodePath,
        )[0];
      });
    });
    return resultJson;
  };
  pathToJson(WorkspaceStore.sourceCodeList);

  const AddFileIcon = ({ nodeData }) => {
    const { nodePath } = nodeData;

    // custom event handler
    const handleClick = () => {
      setIsFile(true);
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
      setIsFile(false);
      handleOpenModal(nodePath);
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
  const [isFile, setIsFile] = React.useState(false);
  const handleOpenModal = (NodePath) => {
    setShowModal(true);
    setPathValue(NodePath);
  };

  const handleCreateModal = () => {
    if (isFile) {
      let newFilePath = pathValue + inputValue;
      let copyNum = 1;
      for (
        copyNum;
        WorkspaceStore.sourceCodeList.filter((s) => s.srcPath === newFilePath)
          .length === 1;
        copyNum++
      ) {
        newFilePath = pathValue + inputValue;
        newFilePath += '(' + copyNum + ')';
      }

      WorkspaceStore.addNewSourceCodeAction({
        srcPath: newFilePath,
        newfile: true,
      });
      EditorContentsStore.updateContentAction(newFilePath, '');
      setShowModal(false);
      setInputValue('');
    } else {
      let node = resultJson;
      let newFilePath = pathValue + inputValue;
      const nodeArray = newFilePath.split('/');
      let nodeTotalPath: string = '';
      nodeArray.forEach((nodePath, index) => {
        if (!node.children) {
          node.children = [];
        }
        nodeTotalPath += nodePath;
        nodeTotalPath += '/';
        let nameArray: Array<String> = node.children.map((child) => child.name);
        if (!nameArray.includes(nodePath)) {
            node.children.push({
              name: nodePath,
              nodePath: nodeTotalPath,
              children: [],
            });
        }
        node = node.children.filter(
          (pathList) => pathList.name === nodePath,
        )[0];
      });
      setShowModal(false);
      setInputValue('');
    }
    return resultJson;
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
              data={resultJson}
              showCheckbox={false}
              indentPixels={18}
              initOpenStatus={false}
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
              {isFile ? (
                <div>
                  <DialogTitle> File name</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Please enter a file name
                    </DialogContentText>
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
                </div>
              ) : (
                <div>
                  <DialogTitle> Folder name</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Please enter a folder name
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="folder name"
                      type="email"
                      fullWidth
                      variant="standard"
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                  </DialogContent>
                </div>
              )}
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