import React, { useState } from "react";
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axiosInstance";

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllStory }) => {
  const [title, setTiltle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  );
  const [visitedDate, setVisitedDate] = useState(
    storyInfo?.visitedDate || null
  );
  const [error, setError] = useState("");

  // Add
  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";

      // Upload image if present
      if (storyImg) {
        console.log("🖼️ Uploading Image:", storyImg);
        const imgUploadsRes = await uploadImage(storyImg);
        console.log("📸 Image Upload Response:", imgUploadsRes);

        imageUrl = imgUploadsRes.imageUrl || "";
        console.log("🖼️ Final Image URL:", imageUrl);
      }

      console.log("🚀 Preparing to send travel story:", {
        title,
        story,
        imageUrl,
        visitedLocation,
        visitedDate,
      });

      // Send travel story API request
      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      console.log("✅ API Response:", response);

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        getAllStory(); // Refresh stories
        onClose(); // Close modal
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("❌ Error adding travel story:", error);
      }
    }
  };

  //   Update
  const updateTravelStory = async () => {
    const storyId = storyInfo._id;
    try {
      let imageUrl = "";

      let postData = {
        title,
        story,
        imageUrl: storyInfo.imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      };

      if (typeof storyImg === "object") {
        // Upload New Image

        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";

        postData = {
          ...postData,
          imageUrl: imageUrl,
        };
      }

      const response = await axiosInstance.put(
        "/edit-story/" + storyId,
        postData
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        getAllStory(); // Refresh stories
        onClose(); // Close modal
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("❌ Error Updating travel story:", error);
      }
    }
  };

  const handleAddOrUpdateClick = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!story) {
      setError("Please enter the story");
      return;
    }

    setError("");

    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };

  //   Delete story image
  const handleDeleteStoryImg = async () => {
    // Deleting Story Image

    const deleteImageRes = await axiosInstance.delete("/delete-image", {
      params: { imageUrl: storyInfo.imageUrl },
    });

    if (deleteImageRes.data) {
      const storyId = storyInfo._id;

      const postData = {
        title,
        story,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: "",
      };

      // Upldating story

      const response = await axiosInstance.put(
        "/edit-story/" + storyId,
        postData
      );

      setStoryImg(null);
    }
  };

  return (
    <div className="relative ">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg" />
                ADD STORY
              </button>
            ) : (
              <div>
                <div>
                  <button
                    className="btn-small"
                    onClick={handleAddOrUpdateClick}
                  >
                    <MdUpdate className="text-lg" />
                    UPDATE STORY
                  </button>
                </div>
              </div>
            )}
            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>
          {error && <p className="text-red-500 text-xs pt-2 text-right"></p>}
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label htmlFor="" className="input-label">
            TITLE
          </label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="Add Story Title"
            value={title}
            onChange={(e) => {
              setTiltle(e.target.value);
            }}
          />

          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>

          <ImageSelector
            image={storyImg}
            setImage={setStoryImg}
            handleDeleteImg={handleDeleteStoryImg}
          />

          <div className="flex flex-col gap-2 mt-4">
            <label htmlFor="input-label">STORY</label>
            <textarea
              type="text"
              name=""
              id=""
              className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
              placeholder="Your Story"
              rows={10}
              value={story}
              onChange={({ target }) => setStory(target.value)}
            />
          </div>

          <div className="pt-3">
            <label htmlFor="" className="input-label">
              VISITED LOCATIONS
            </label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;

{
  /* <button className="btn-small btn-delete" onClick={onClose}>
  <MdDeleteOutline className="text-lg" />
  DELETE
</button>; */
}
