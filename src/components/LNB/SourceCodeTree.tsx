/* eslint-disable no-unused-vars */
import * as React from 'react';
import FolderTree, { IconComponents } from 'react-folder-tree';
import WorkspaceStore from '../../stores/workspaceStore';
import { Observer, observer } from 'mobx-react';
import { sendMessage } from '../../utils/service-utils';
import 'react-folder-tree/dist/style.css';
import EditorContentsStore from '../../stores/editorContentsStore';
import {
  NoteAdd,
  CreateNewFolder,
  Close,
  Delete,
  // Edit,
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

const SourceCodeTree: React.FC = () => {
  const onSourceCodeLinkClick = ({ nodeData }) => {
    const { isFile, srcId, newfile, srcPath, edited } = nodeData;
    if (isFile) {
      if (newfile || edited) {
        const editorContent = WorkspaceStore.getContentAction(srcPath);
        EditorContentsStore.updateContentAction(srcPath, editorContent);
      } else {
        sendMessage('source', 'DetailService', {
          src_id: srcId,
          commit_id: WorkspaceStore.currentCommit.commitId,
        });
      }
    }
  };
  const resultJson = {
    name: WorkspaceStore.currentProject.name,
    children: [],
    isOpen: true,
    nodePath: '',
  };
  const pathToJson = (sourceCodeList) => {
    sourceCodeList.forEach((src) => {
      let node = resultJson;
      const srcId = src.srcId;
      const originalNodeArray = src.srcPath.split('/');
      const nodeArray = originalNodeArray.slice(1);
      let nodeTotalPath: string = originalNodeArray[0] + '/';
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
          else {
            node.children.push({
              name: nodePath,
              nodePath: nodeTotalPath,
              isOpen: false,
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

  const DeleteIcon = ({ onClick: defaultOnClick, nodeData }) => {
    const { srcPath, name, isFile, nodePath } = nodeData;
    const handleClick = () => {
      setIsFile(isFile);
      if (isFile) {
        handleOpenDeleteModal(srcPath, name);
      } else {
        const folderPath = nodePath.slice(0, -1);
        handleOpenDeleteModal(folderPath, name);
      }
    };
    return <Delete fontSize="small" onClick={handleClick} />;
  };

  const EditIcon = () => {
    // const { srcPath, edited, newfile, content, isFile, nodePath } = nodeData;
    // const handleClick = () =>
    // {
    // if (edited || newfile) {
    //   setContent(content);
    // } else {
    //   setContent('');
    // }
    // handleOpenEditModal(srcPath, isFile, nodePath);
    // }
    // return <Edit fontSize="small" onClick={handleClick} />;
    return <></>;
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
    };
    return <KeyboardArrowRight fontSize="small" onClick={handleClick} />;
  };

  const CaretDownIcon = ({ onClick: defaultOnClick, nodeData }) => {
    const { nodePath } = nodeData;
    const handleClick = () => {
      defaultOnClick();
      FolderTreeStore.changeToCloseAction(nodePath);
    };
    return <KeyboardArrowDown fontSize="small" onClick={handleClick} />;
  };

  const [showModal, setShowModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [pathValue, setPathValue] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [content, setContent] = React.useState('');
  const [isFile, setIsFile] = React.useState(false);
  const [needUpdate, setNeedUpdate] = React.useState(true);

  const updateTreeData = () => {
    FolderTreeStore.updateTreeDataAction(
      pathToJson(WorkspaceStore.sourceCodeList),
    );
    setNeedUpdate(false);
  };

  if (needUpdate) {
    updateTreeData();
  }

  const handleOpenModal = (NodePath) => {
    setShowModal(true);
    setPathValue(NodePath);
  };

  const handleOpenEditModal = (srcPath, isFile, nodePath) => {
    if (isFile) {
      setShowEditModal(true);
      setPathValue(srcPath);
      setIsFile(isFile);
    } else {
      const folderPath = nodePath.slice(0, -1);
      setShowEditModal(true);
      setPathValue(folderPath);
      setIsFile(isFile);
    }
  };

  const handleOpenDeleteModal = (srcPath, name) => {
    setShowDeleteModal(true);
    setPathValue(srcPath);
    setFileName(name);
  };

  const handleCreateModal = () => {
    let newNodePath = pathValue + inputValue;
    if (isFile) {
      let copyNum = 1;
      for (
        copyNum;
        WorkspaceStore.sourceCodeList.filter((s) => s.srcPath === newNodePath)
          .length === 1;
        copyNum++
      ) {
        newNodePath = pathValue + inputValue;
        newNodePath += '(' + copyNum + ')';
      }

      WorkspaceStore.addNewSourceCodeAction({
        srcPath: newNodePath,
        newfile: true,
      });
      EditorContentsStore.updateContentAction(newNodePath, '');
      FolderTreeStore.addNewFileAction(newNodePath);
    } else {
      FolderTreeStore.addNewFolderAction(newNodePath);
    }
    setShowModal(false);
    setInputValue('');
    setNeedUpdate(false);
  };
  const checkDuplicate = (newNodePath) => {
    const resultJson = FolderTreeStore.folderTreeData;
    let result = false;
    let node = resultJson;
    const originNodeArray = newNodePath.split('/');
    const nodeArray = originNodeArray.splice(1);
    nodeArray.forEach((nodePath, index) => {
      if (index === nodeArray.length - 1) {
        if (node.children.filter((c) => c.name === nodePath).length === 1) {
          result = true;
        }
      }
      node = node.children.filter((pathList) => pathList.name === nodePath)[0];
    });
    return result;
  };

  const handleEditModal = () => {
    const lastPathArray = pathValue.split('/');
    let newPath: string = '';
    lastPathArray.forEach((nodePath, index) => {
      if (index < lastPathArray.length - 1) {
        newPath += nodePath;
        newPath += '/';
      }
    });
    let newNodePath = newPath + inputValue;
    let newNodeName = inputValue;
    if (checkDuplicate(newNodePath)) {
      if (isFile) {
        alert('동일한 이름의 파일이 존재합니다!');
      } else {
        alert('동일한 이름의 폴더가 존재합니다!');
      }
    } else if (isFile) {
      let copyNum = 1;
      for (
        copyNum;
        WorkspaceStore.sourceCodeList.filter(
          (s) => s.srcPath === newNodePath && !s.deleted,
        ).length === 1;
        copyNum++
      ) {
        newNodeName = inputValue;
        newNodePath += '(' + copyNum + ')';
        newNodePath = newPath + inputValue;
        newNodePath += '(' + copyNum + ')';
      }
      EditorContentsStore.renameSourceCodeAction(pathValue, newNodePath);
      WorkspaceStore.renameSourceCodeAction(pathValue, newNodePath, content);
      FolderTreeStore.renameNodeAction(
        pathValue,
        newNodeName,
        newNodePath,
        content,
      );
      setShowEditModal(false);
      setInputValue('');
      setNeedUpdate(false);
    } else {
      FolderTreeStore.renameFolderAction(pathValue, newNodePath, newNodeName);
      setShowEditModal(false);
      setInputValue('');
      setNeedUpdate(false);
    }
  };
  const handleDeleteModal = () => {
    if (isFile) {
      WorkspaceStore.deleteSourceCodeAction(pathValue);
      EditorContentsStore.deleteSourceCodeAction(pathValue);
      FolderTreeStore.deleteSourceCodeAction(pathValue);
    } else {
      WorkspaceStore.deleteDirectoryAction(pathValue);
      EditorContentsStore.deleteDirectoryAction(pathValue);
      FolderTreeStore.deleteSourceCodeAction(pathValue);
    }
    setShowDeleteModal(false);
    setInputValue('');
    setNeedUpdate(false);
  };
  const handleCancelModal = () => {
    setShowModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
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
              data={FolderTreeStore.folderTreeData}
              showCheckbox={false}
              indentPixels={20}
              onNameClick={onSourceCodeLinkClick}
              initOpenStatus="custom"
              iconComponents={
                {
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
                } as IconComponents
              }
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
            <Dialog open={showEditModal} onClose={handleCancelModal}>
              <div>
                <DialogTitle>Edit File name</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please enter a file name to change
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
                <DialogActions>
                  <Button onClick={handleCancelModal}>Cancel</Button>
                  <Button onClick={handleEditModal}>Edit</Button>
                </DialogActions>
              </div>
            </Dialog>
            <Dialog open={showDeleteModal} onClose={handleCancelModal}>
              {isFile ? (
                <div>
                  <DialogTitle>File delete</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to delete {fileName}?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCancelModal}>Cancel</Button>
                    <Button onClick={handleDeleteModal}>Delete</Button>
                  </DialogActions>
                </div>
              ) : (
                <div>
                  <DialogTitle>Folder delete</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to delete {fileName}?
                    </DialogContentText>
                    <DialogContentText>
                      All folder contents will be deleted
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCancelModal}>Cancel</Button>
                    <Button onClick={handleDeleteModal}>Delete</Button>
                  </DialogActions>
                </div>
              )}
            </Dialog>
          </div>
        </div>
      )}
    </Observer>
  );
};

export default observer(SourceCodeTree);
