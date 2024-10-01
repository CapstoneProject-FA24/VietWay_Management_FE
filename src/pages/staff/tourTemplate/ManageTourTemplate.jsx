import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarStaff from "@layouts/SidebarStaff";
import { Helmet } from "react-helmet";
import { Box, Grid, Typography, Button, MenuItem, Select, TextField, InputAdornment, Tabs, Tab } from "@mui/material";
import {mockTourTemplateCategories, mockProvinces, mockTourStatus } from "@hooks/MockTourTemplate";
import TourTemplateCard from "@components/staff/TourTemplateCard";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Link, useLocation } from "react-router-dom";
import TourTemplateDeletePopup from "@components/staff/TourTemplateDeletePopup";

const ManageTourTemplate = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tourTemplates, setTourTemplates] = useState([]);
  const [filteredTourTemplates, setFilteredTourTemplates] = useState([]);
  const [sortOrder, setSortOrder] = useState("name");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState([]);
  const [statusTab, setStatusTab] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const location = useLocation();
  const currentPage = location.pathname;
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    fetchTourTemplates();
  }, [pageSize, pageIndex]);

  const fetchTourTemplates = async () => {
    try {
      const response = await axios.get(
        `https://vietwayapi-e7dqcdgef5e2dxgn.southeastasia-01.azurewebsites.net/api/TourTemplate?pageSize=${pageSize}&pageIndex=${pageIndex}`
      );
      if (response.data.statusCode === 200) {
        setTourTemplates(response.data.data.items);
        setFilteredTourTemplates(response.data.data.items);
        setTotalItems(response.data.data.total);

        // Extract unique status values from the API response
        const uniqueStatuses = [
          ...new Set(response.data.data.items.map((item) => item.status)),
        ];
        setStatusOptions(uniqueStatuses);
      }
    } catch (error) {
      console.error("Error fetching tour templates:", error);
    }
  };

  useEffect(() => {
    filterAndSortTourTemplates();
  }, [searchTerm, sortOrder, selectedCategories, selectedProvinces, selectedDuration, tourTemplates, statusTab]);

  const filterAndSortTourTemplates = () => {
    let filtered = [...tourTemplates];
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.tourName.toLowerCase().includes(searchTermLower) ||
          t.code.toLowerCase().includes(searchTermLower)
      );
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((t) =>
        selectedCategories.some((c) => c.value === t.tourCategoryId)
      );
    }
    if (selectedProvinces.length > 0) {
      filtered = filtered.filter((t) =>
        selectedProvinces.some((p) => t.provinces.includes(p.value))
      );
    }
    if (selectedDuration.length > 0) {
      filtered = filtered.filter((t) =>
        selectedDuration.some((p) => p.value === t.duration)
      );
    }
    if (statusTab !== "all") {
      filtered = filtered.filter((a) => a.status === statusTab);
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortOrder === "name") {
        return a.tourName.localeCompare(b.tourName);
      } else if (sortOrder === "date") {
        return new Date(b.createdDate) - new Date(a.createdDate);
      }
      return 0;
    });

    setFilteredTourTemplates(filtered);
  };

  const categoryOptions = mockTourTemplateCategories.map((category) => ({
    value: category.CategoryName,
    label: category.CategoryName,
  }));

  const durationOptions = Array.from(
    new Set(tourTemplates.map((t) => t.Duration))
  ).map((duration) => ({
    value: duration,
    label: duration,
  }));

  const provinceOptions = mockProvinces.map((province) => ({
    value: province.ProvinceName,
    label: province.ProvinceName,
  }));

  const handleStatusTabChange = (event, newValue) => {
    setStatusTab(newValue);
    filterTourTemplates(newValue);
  };

  const filterTourTemplates = (status) => {
    if (status === "all") {
      setFilteredTourTemplates(tourTemplates);
    } else {
      const statusNumber = parseInt(status);
      const filtered = tourTemplates.filter(
        (template) => template.status === statusNumber
      );
      setFilteredTourTemplates(filtered);
    }
  };

  const animatedComponents = makeAnimated();

  const handleOpenDeletePopup = (template) => {
    setSelectedTemplate(template);
    setOpenDeletePopup(true);
  };

  const handleCloseDeletePopup = () => {
    setOpenDeletePopup(false);
    setSelectedTemplate(null);
  };

  const handleDeleteTemplate = (templateId) => {
    /*  // Implement the delete logic here
        console.log(`Deleting template with ID: ${templateId}`);
        // After deletion, update the tourTemplates state and close the popup
        setTourTemplates(prevTemplates => prevTemplates.filter(t => t.TourTemplateId !== templateId));
        handleCloseDeletePopup(); */
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SidebarStaff
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Box
        sx={{
          flexGrow: 1,
          p: isSidebarOpen ? 5 : 3,
          transition: "margin-left 0.3s",
          marginLeft: isSidebarOpen ? "260px" : "20px",
        }}
      >
        <Grid container spacing={3} sx={{ mb: 3, ml: -2.7 }}>
          <Grid item xs={8.5} sx={{ mb: 1 }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ width: "50%", mr: 0.5, mb: 1.5 }}>
                <Typography sx={{ mt: 2 }}>Tỉnh/Thành phố</Typography>
                <ReactSelect
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={provinceOptions}
                  onChange={setSelectedProvinces}
                />
              </Box>
              <Box sx={{ width: "50%", ml: 0.5, mb: 1.5 }}>
                <Typography sx={{ mt: 2 }}>Thời lượng</Typography>
                <ReactSelect
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={durationOptions}
                  onChange={setSelectedDuration}
                />
              </Box>
            </Box>
            <Typography>Loại Tour</Typography>
            <ReactSelect
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={categoryOptions}
              onChange={setSelectedCategories}
            />
          </Grid>
          <Grid
            item
            xs={3.5}
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
          >
            <Button
              component={Link}
              to={currentPage + "/them"}
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ height: "55px", borderRadius: 2 }}
            >
              Thêm Tour mẫu
            </Button>
          </Grid>
          <Grid item xs={7}>
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm tour mẫu..."
              size="small"
              sx={{ width: "80%" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid
            item
            xs={5}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography>Sắp xếp theo</Typography>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              variant="outlined"
              sx={{ width: "200px", ml: 2, height: "40px" }}
            >
              <MenuItem value="name">Tên A-Z</MenuItem>
              <MenuItem value="date">Ngày cập nhật</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Tabs
              value={statusTab}
              onChange={handleStatusTabChange}
              aria-label="tour template status tabs"
            >
              <Tab label="Tất cả" value="all" />
              <Tab label="Bản nháp" value="0" />
              <Tab label="Chờ duyệt" value="1" />
              <Tab label="Đã duyệt" value="2" />
              <Tab label="Đã bị từ chối" value="3" />
            </Tabs>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ minHeight: "15.2rem" }}>
          {filteredTourTemplates.map((tourTemplate) => (
            <Grid
              item
              xs={isSidebarOpen ? 12 : 6}
              key={tourTemplate.TourTemplateId}
            >
              <TourTemplateCard
                tour={tourTemplate}
                isOpen={isSidebarOpen}
                onOpenDeletePopup={handleOpenDeletePopup}
              />
            </Grid>
          ))}
        </Grid>
        <TourTemplateDeletePopup
          open={openDeletePopup}
          onClose={handleCloseDeletePopup}
          template={selectedTemplate}
          onDelete={handleDeleteTemplate}
        />
      </Box>
    </Box>
  );
};

const getStatusText = (status) => {
  switch (status) {
    case 0:
      return "Bản nháp";
    case 1:
      return "Chờ duyệt";
    case 2:
      return "Đã duyệt";
    case 3:
      return "Đã bị từ chối";
    default:
      return "Không xác định";
  }
};

export default ManageTourTemplate;
