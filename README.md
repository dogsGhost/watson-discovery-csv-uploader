# CSV Uploader for Watson Discovery Service

A csv file seems like a great source of data when leveraging the Watson Discovery service. But a Discovery service collection does not allow you to upload csv files. This may or may not be related to the fact that each upload is considered one data point in a collection, where as a csv file actually contains numerous data points.

As a workaround to this, this application allows anyone with the proper creditials to upload a csv file and have it automatically added to the respective Discovery collection with each line in the csv file added as an individual entry.

## setup

To run locally:
- download repo
- `npm install`
- `npm start`
- open `localhost:3000` in a browser

## to add a file

You'll need the following information related to the Discovery collection to which you wish to contribute:
- username
- password
- collection_id
- environment_id

## notes

Try to avoid special characters in the row headings of your csv file. Some special characters can cause the upload to the Discovery collection to fail silently.
