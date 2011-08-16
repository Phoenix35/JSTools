<?php
// This file is returning a thumbnail of the passed image
// Arguments:
// $originX, $originY, $width, $height, $image
// © Cron


if(isset($_GET["params"]))
{
	list($originX, $originY, $width, $height, $image) = explode(",", $_GET["params"]);
	
	if(!$originX || empty($originX))
		die("I don't know where to start thumbnailing (X coordinate)");
	if(!$originY || empty($originY))
		die("I don't know where to start thumbnailing (Y coordinate)");
	if(!$width || empty($width))
		die("I don't know how wide the thumbnail should be !");
	if(!$height || empty($height))
		die("I don't know how high the thumbnail should be !");
	if(!$image || empty($image))
		die("I don't know on what I should work !");
		
	$extension = substr(strrchr($image, "."), 1);
	$extensionRef = array("jpg", "jpeg", "png");
	
	if(!in_array($extension, $extensionRef))
		die("The file extension is not authorized.");
	
	header("Content-type: image/" . $extension);

	// On peut travailler sur l'image
	if($extension == "jpg" || $extension == "jpeg")
		$imageHandle = imagecreatefromjpeg($image);
	else if($extension == "png")
		$imageHandle = imagecreatefrompng($image);
		
	// On vérifie si la largeur / hauteur demandée dépasse la taille de l'image
	if($width  > imagesx($imageHandle)) { $width  = imagesx($imageHandle); }
	if($height > imagesy($imageHandle)) { $height = imagesy($imageHandle); }
	
	// On crée l'image de destination, qu'on renverra. 
	$dest = imagecreatetruecolor($width, $height);
	
	// On copie les pixels dans la destination
	imagecopy($dest, $imageHandle, 0, 0, $originX, $originY, $width, $height);
		
	if($extension == "jpg" || $extension == "jpeg")
		imagejpeg($dest);
	else if($extension == "png")
		imagepng($dest);
		
	imagedestroy($dest);
	imagedestroy($imageHandle);
}
