<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $crop_name = $_POST["crop_name"];
    $file_name = $_FILES["crop_image"]["name"];
    $file_tmp = $_FILES["crop_image"]["tmp_name"];
    $upload_dir = "uploads/";

    // Check if the file was uploaded without errors
    if (move_uploaded_file($file_tmp, $upload_dir . $file_name)) {
        echo "Crop image uploaded successfully.";
    } else {
        echo "Error uploading file.";
    }
}
?>
