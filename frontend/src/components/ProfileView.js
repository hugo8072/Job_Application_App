import React, { useState } from 'react';
import {
  Box, Paper, Typography, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Select, MenuItem, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

/**
 * ProfileView Component - Presentational component for user profile interface
 * Displays job applications in a futuristic table with filtering capabilities
 * This is a pure presentational component that receives all data and handlers as props
 * @param {Object} props - The component props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.setFilters - Handler for filter changes
 * @param {Function} props.uniqueOptions - Function to get unique options for filters
 * @param {Array} props.filteredJobs - Filtered job applications
 * @param {Array} props.jobs - All job applications
 * @param {Object} props.newJob - New job form data
 * @param {Function} props.setNewJob - Handler for new job form changes
 * @param {Function} props.handleChange - Handler for new job form field changes
 * @param {Function} props.handleJobFieldChange - Handler for job field changes
 * @param {Function} props.handleUpdateJob - Handler for updating jobs
 * @param {Function} props.handleDeleteJob - Handler for deleting jobs
 * @param {Function} props.handleAddJob - Handler for adding jobs
 * @param {Function} props.getDateValue - Handler for date formatting
 * @param {string} props.userName - Current user's name
 * @returns {JSX.Element} Rendered profile view component
 */
function ProfileView({
  filters,
  setFilters,
  uniqueOptions,
  filteredJobs,
  jobs,
  newJob,
  setNewJob,
  handleChange, // <-- Receives handleChange from Profile.js
  handleJobFieldChange,
  handleUpdateJob,
  handleDeleteJob,
  handleAddJob,
  getDateValue,
  userName,
}) {
  /**
   * State for delete confirmation dialog
   * @type {Object}
   */
  const [deleteDialog, setDeleteDialog] = useState({ open: false, job: null });

  /**
   * State for add job form validation errors
   * @type {Object}
   */
  const [addError, setAddError] = useState({});
  
  /**
   * Enhanced handleChange wrapper for new job form with error clearing
   * @param {Event} e - Input change event
   */
  const handleNewJobChange = (e) => {
    handleChange(e); // Use the handleChange from Profile.js
    // Clear error when user starts typing
    const { name } = e.target;
    setAddError(prev => ({ ...prev, [name]: '' }));
  };

  /**
   * Validates and adds a new job with form validation
   */
  const handleAddJobWithValidation = () => {
    const errors = {};
    if (!newJob.Position) errors.Position = 'Position is required';
    if (!newJob.Company) errors.Company = 'Company is required';
    if (!newJob['Applied date']) errors['Applied date'] = 'Applied Date is required';

    setAddError(errors);

    if (Object.keys(errors).length === 0) {
      handleAddJob();
    }
  };

  /**
   * Handles user logout by clearing localStorage and redirecting
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/users/login';
  };

  /**
   * Opens the delete confirmation dialog
   * @param {Object} job - Job object to delete
   */
  const openDeleteDialog = (job) => {
    setDeleteDialog({ open: true, job });
  };

  /**
   * Closes the delete confirmation dialog
   */
  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, job: null });
  };

  /**
   * Confirms and executes job deletion
   */
  const confirmDelete = () => {
    if (deleteDialog.job) {
      handleDeleteJob(deleteDialog.job._id);
    }
    closeDeleteDialog();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(120deg, #0f2027, #232526, #0f2027, #00ff99 80%)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <style>
        {`
          @keyframes gradientBG {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
        `}
      </style>
      <Paper
        elevation={16}
        sx={{
          bgcolor: '#232526',
          borderRadius: 6,
          minWidth: 1000,
          p: 4,
          boxShadow: '0 8px 32px 0 #00ff9977',
          border: '1.5px solid #00ff99',
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography
            variant="h3"
            sx={{
              color: '#00ff99',
              fontWeight: 900,
              letterSpacing: 3,
              textShadow: '0 0 16px #00ff99, 0 4px 32px #0f2027',
              fontFamily: 'Orbitron, monospace',
            }}
          >
            {userName ? `${userName}'s Job Applications` : 'Job Applications'}
          </Typography>
          
          {/* Filter section */}
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" sx={{ mb: 2 }}>
            <TextField
              label="Position"
              value={filters.Position}
              onChange={e => setFilters({ ...filters, Position: e.target.value })}
              sx={filterFieldSx}
              size="small"
            />
            <TextField
              label="Company"
              value={filters.Company}
              onChange={e => setFilters({ ...filters, Company: e.target.value })}
              sx={filterFieldSx}
              size="small"
            />
            <TextField
              label="Phase"
              value={filters.Phase}
              onChange={e => setFilters({ ...filters, Phase: e.target.value })}
              sx={filterFieldSx}
              size="small"
            />
            <Select
              value={filters.CL}
              onChange={e => setFilters({ ...filters, CL: e.target.value })}
              displayEmpty
              sx={filterFieldSx}
              size="small"
              inputProps={{
                sx: { color: '#1de9b6', fontFamily: 'monospace', background: 'transparent' }
              }}
            >
              <MenuItem value="">CL</MenuItem>
              <MenuItem value="true">true</MenuItem>
              <MenuItem value="false">false</MenuItem>
            </Select>
            <Select
              value={filters.Status}
              onChange={e => setFilters({ ...filters, Status: e.target.value })}
              displayEmpty
              sx={filterFieldSx}
              size="small"
              inputProps={{
                sx: { color: '#1de9b6', fontFamily: 'monospace', background: 'transparent' }
              }}
            >
              <MenuItem value="">Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
            <TextField
              label="Note"
              value={filters.Note}
              onChange={e => setFilters({ ...filters, Note: e.target.value })}
              sx={filterFieldSx}
              size="small"
            />
            <TextField
              label="Applied Date"
              type="date"
              value={filters['Applied date']}
              onChange={e => setFilters({ ...filters, 'Applied date': e.target.value })}
              sx={filterFieldSx}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          {/* Jobs table */}
          <TableContainer component={Paper} sx={{ bgcolor: '#181c1f', borderRadius: 4, boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeaderSx}>Position</TableCell>
                  <TableCell sx={tableHeaderSx}>Company</TableCell>
                  <TableCell sx={tableHeaderSx}>Phase</TableCell>
                  <TableCell sx={tableHeaderSx}>CL</TableCell>
                  <TableCell sx={tableHeaderSx}>Status</TableCell>
                  <TableCell sx={tableHeaderSx}>Note</TableCell>
                  <TableCell sx={tableHeaderSx}>Applied Date</TableCell>
                  <TableCell sx={tableHeaderSx}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ color: '#888' }}>
                      No jobs found. Add a new job below!
                    </TableCell>
                  </TableRow>
                )}
                {filteredJobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell>
                      <TextField
                        value={job.Position}
                        onChange={e => handleJobFieldChange(job._id, 'Position', e.target.value)}
                        variant="standard"
                        sx={tableInputSx}
                        InputProps={{ disableUnderline: true }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={job.Company}
                        onChange={e => handleJobFieldChange(job._id, 'Company', e.target.value)}
                        variant="standard"
                        sx={tableInputSx}
                        InputProps={{ disableUnderline: true }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={job.Phase}
                        onChange={e => handleJobFieldChange(job._id, 'Phase', e.target.value)}
                        variant="standard"
                        sx={tableInputSx}
                        InputProps={{ disableUnderline: true }}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={job.CL}
                        onChange={e => handleJobFieldChange(job._id, 'CL', e.target.checked, 'checkbox')}
                        style={{ accentColor: '#00ff99', width: 18, height: 18 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={job.Status ? 'Active' : 'Inactive'}
                        onChange={e => handleJobFieldChange(job._id, 'Status', e.target.value === 'Active', 'select')}
                        sx={tableInputSx}
                        variant="standard"
                        disableUnderline
                        inputProps={{
                          sx: { color: '#1de9b6', fontFamily: 'monospace', background: 'transparent' }
                        }}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={job.Note}
                        onChange={e => handleJobFieldChange(job._id, 'Note', e.target.value)}
                        variant="standard"
                        sx={tableInputSx}
                        InputProps={{ disableUnderline: true }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={getDateValue(job['Applied date'])}
                        onChange={e => handleJobFieldChange(job._id, 'Applied date', e.target.value)}
                        variant="standard"
                        sx={tableInputSx}
                        InputProps={{ disableUnderline: true }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          const updatedJob = jobs.find(j => j._id === job._id);
                          handleUpdateJob(updatedJob);
                        }}
                        sx={{ color: '#00ff99' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => openDeleteDialog(job)}
                        sx={{ color: '#ff3333' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Add new job row */}
                <TableRow>
                  <TableCell>
                    <TextField
                      name="Position"
                      value={newJob.Position}
                      onChange={handleNewJobChange}
                      variant="standard"
                      sx={tableInputSx}
                      InputProps={{ disableUnderline: true }}
                      error={!!addError.Position}
                      helperText={addError.Position}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="Company"
                      value={newJob.Company}
                      onChange={handleNewJobChange}
                      variant="standard"
                      sx={tableInputSx}
                      InputProps={{ disableUnderline: true }}
                      error={!!addError.Company}
                      helperText={addError.Company}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="Phase"
                      value={newJob.Phase}
                      onChange={handleNewJobChange}
                      variant="standard"
                      sx={tableInputSx}
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="checkbox"
                      name="CL"
                      checked={newJob.CL}
                      onChange={handleNewJobChange}
                      style={{ accentColor: '#00ff99', width: 18, height: 18 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      name="Status"
                      value={newJob.Status ? 'Active' : 'Inactive'}
                      onChange={e => setNewJob({ ...newJob, Status: e.target.value === 'Active' })}
                      sx={tableInputSx}
                      variant="standard"
                      disableUnderline
                      inputProps={{
                        sx: { color: '#1de9b6', fontFamily: 'monospace', background: 'transparent' }
                      }}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="Note"
                      value={newJob.Note}
                      onChange={handleNewJobChange}
                      variant="standard"
                      sx={tableInputSx}
                      InputProps={{ disableUnderline: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="Applied date"
                      type="date"
                      value={getDateValue(newJob['Applied date'])}
                      onChange={handleNewJobChange}
                      variant="standard"
                      sx={tableInputSx}
                      InputProps={{ disableUnderline: true }}
                      error={!!addError['Applied date']}
                      helperText={addError['Applied date']}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="success"
                      onClick={handleAddJobWithValidation}
                      sx={{ color: '#00ff99' }}
                    >
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Logout button */}
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderRadius: 3,
              px: 5,
              fontWeight: 700,
              color: '#00ff99',
              borderColor: '#00ff99',
              mt: 3,
              transition: 'transform 0.2s, border-color 0.2s, color 0.2s',
              '&:hover': {
                transform: 'scale(1.07)',
                borderColor: '#fff',
                color: '#fff',
                background: 'rgba(0,255,153,0.08)',
              },
            }}
          >
            Logout
          </Button>
        </Stack>
      </Paper>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        PaperProps={{
          sx: {
            bgcolor: '#232526',
            border: '1.5px solid #00ff99',
            borderRadius: 4,
            color: '#1de9b6',
            minWidth: 350,
          }
        }}
      >
        <DialogTitle sx={{ color: '#00ff99', fontFamily: 'Orbitron, monospace', fontWeight: 700 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#fff', mb: 2 }}>
            Are you sure you want to delete the job
            <span style={{ color: '#00ff99', fontWeight: 700 }}> {deleteDialog.job?.Position} </span>
            at
            <span style={{ color: '#00ff99', fontWeight: 700 }}> {deleteDialog.job?.Company} </span>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeDeleteDialog}
            sx={{
              color: '#00ff99',
              borderColor: '#00ff99',
              borderRadius: 2,
              fontWeight: 700,
              '&:hover': {
                background: 'rgba(0,255,153,0.08)',
                color: '#fff',
                borderColor: '#fff',
              },
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            sx={{
              color: '#ff3333',
              borderColor: '#ff3333',
              borderRadius: 2,
              fontWeight: 700,
              '&:hover': {
                background: 'rgba(255,51,51,0.08)',
                color: '#fff',
                borderColor: '#fff',
              },
            }}
            variant="outlined"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Styles for filter fields
const filterFieldSx = {
  minWidth: 120,
  mx: 0.5,
  bgcolor: '#181c1f',
  borderRadius: 2,
  '& .MuiInputBase-root': {
    color: '#1de9b6',
    fontFamily: 'monospace',
  },
  '& .MuiInputLabel-root': {
    color: '#1de9b6',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1de9b6',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#00ff99',
  },
};

// Styles for table headers
const tableHeaderSx = {
  color: '#00ff99',
  fontWeight: 700,
  background: '#181c1f',
  borderBottom: '2px solid #00ff99',
  fontFamily: 'monospace',
};

// Styles for table input fields
const tableInputSx = {
  bgcolor: '#232526',
  color: '#1de9b6',
  fontFamily: 'monospace',
  borderRadius: 1,
  px: 1,
  '& input': {
    color: '#1de9b6',
    fontFamily: 'monospace',
    background: 'transparent',
  },
};

export default ProfileView;