import * as React from 'react';
import FolderTree, { IconComponents } from 'react-folder-tree';
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
  KeyboardArrowDown,
  KeyboardArrowRight,
} from '@mui/icons-material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { getIcon } from 'material-file-icons';
import FolderTreeStore from '../../stores/folderTreeStore';

export const SourceCodeTree: React.FC = () => {

  const onSourceCodeLinkClick = ({ nodeData }) => {
    const { isFile, srcId, newfile, srcPath, content, edited, nodePath } = nodeData;
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
    else{
      console.log(nodePath.split('/'));
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
        const nameArray: Array<String> = node.children.map(
          (child) => child.name,
        );
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
          else if (index > 0) {
            node.children.push({
              name: nodePath,
              nodePath: nodeTotalPath,
              isOpen: false,
              isFile: false,
              children: [],
            });
          } else {
            node.children.push({
              name: nodePath,
              nodePath: nodeTotalPath,
              isOpen: true,
              isFile: false,
              children: [],
            });
          }
          node.children.sort((a, b) => a.name.localeCompare(b.name));
          node.children.sort((a, b) => a.isFile - b.isFile);
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

  const FileIcon = ({ onClick: defaultOnClick, nodeData }) => {
    const { name } = nodeData;
    const handleClick = () => {
      defaultOnClick();
    };
    return (
      <div
        className="file-icon"
        dangerouslySetInnerHTML={{ __html: getIcon(name).svg }}
        onClick={handleClick}
      />
    );
  };

  const CaretRightIcon = ({ onClick: defaultOnClick, nodeData }) => {
    const { nodePath } = nodeData;
    const handleClick = () => {
      defaultOnClick();
      FolderTreeStore.changeToOpenAction(nodePath);
      fileTreeData = FolderTreeStore.folderTreeData;
    };
    return <KeyboardArrowRight fontSize="small" onClick={handleClick} />;
  };

  const CaretDownIcon = ({ onClick: defaultOnClick, nodeData }) => {
    const { nodePath } = nodeData;
    const handleClick = () => {
      defaultOnClick();
      FolderTreeStore.changeToCloseAction(nodePath);
      fileTreeData = FolderTreeStore.folderTreeData;
    };
    return <KeyboardArrowDown fontSize="small" onClick={handleClick} />;
  };

  const [showModal, setShowModal] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [pathValue, setPathValue] = React.useState('');
  const [isFile, setIsFile] = React.useState(false);
  const [needUpdate, setNeedUpdate] = React.useState(true);

  const updateTreeData = ()=>{
    FolderTreeStore.updateTreeDataAction(pathToJson(WorkspaceStore.sourceCodeList));
    setNeedUpdate(false);
  };
  let fileTreeData = FolderTreeStore.folderTreeData;

  if(needUpdate){
    updateTreeData();
  }

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
    FolderTreeStore.updatePathToJsonAction(WorkspaceStore.sourceCodeList);
    setNeedUpdate(false);
    console.log(444,WorkspaceStore.sourceCodeList);
    fileTreeData = FolderTreeStore.folderTreeData;
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
              data={fileTreeData}
              showCheckbox={false}
              indentPixels={18}
              onNameClick={onSourceCodeLinkClick}
              initOpenStatus="custom"
              iconComponents={{
                AddFileIcon,
                AddFolderIcon,
                CancelIcon,
                DeleteIcon,
                EditIcon,
                FolderIcon,
                FolderOpenIcon,
                FileIcon,
                CaretDownIcon,
                CaretRightIcon,
              } as IconComponents}
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
