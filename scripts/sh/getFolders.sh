#!/bin/bash

user1=`girder-client --session user --url http://localhost:8080 --api /api/v1 --command login $1 $2 --extract content.user._id`
collectionID=`girder-client --session user --command listCollections --extract content.0._id`
girder-client --session user --command listFolders --json "{ \"parentType\": \"collection\", \"parentId\": \"${collectionID}\"}" --extract content
girder-client --session user --reset
