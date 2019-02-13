# SPM-2018-SSRFC 
<i>University of Camerino, School of Science and Technology - Master Degree - Computer Science (LM-18) - Project repository for the Software Project Management course - a.y. 2018/2019</i><br><br><br>
![](https://github.com/PROSLab/SPM-2018-SSRFC/blob/master/SPMClient/src/assets/images/logo-icon.png)
# VuGit: your online repository for .bpmn models



## Project description
The project consists of a web platform called VuGit which allows users to register and access the different .bpmn files uploaded to the platform repositories. Briefly, each registered user has a private repository accessible only to that user, while he can have access to all public repositories also of other users. Within a repository the user can create a .bpmn file, create folders, delete files, move folders... almost like Google Drive. The most important thing is that for the same .bpmn file, the user can create different versions, then work on the desired version in order to have a history of the changes made to the same .bpmn model. User can open the desired version of the .bpmn file in the bpmn.io editor built-in inside the platform, or download directly this version, or a collection of versions for the same model, to his local machine. Once the model is opened on the bpmn.io editor, the user can check the validity and soundness of the model and see the results shown. The registered user will have at his disposal a search bar to search for a bpmn model in a repository and will be able to share his own models with other users.

## Installation
Before downloading the project you need to prepare your local machine: for client-side project part Node.js is needed; instead for the server-side part you need to install Eclipse IDE for Java EE Developers. Since the frontend part of the project was made with <b>Angular.js</b>, to start it you will need <b>Node.js</b>; while the server part is built using <b>Java Spring WebFlux with Maven</b> and then you'll need <b>Java EE IDE</b> to run the server. Now you can download our SPM-2018-SSRFC folder. Inside SPM-2018-SSRFC you will find <b>two main subfolders</b>, one is called <b>SPMClient</b> and contains all the client-side files; instead the other folder <b>SPMServer</b> contains server-side files. 

## Usage
Now to run the project it is necessary to simultaneously execute the client part and the server part:
<ul>
  <li><b>Run SPMClient</b>: first at level SPM-2018-SSRFC\SPMClient you need to execute the command <b>npm install</b> and then <b>npm start</b>. Once npm start is finished, usually an Angular Live Development Server will listen on localhost:4200, so to see the client part you need to open in your browser on http://localhost:4200/. If you try to use the platform now, it won't work because the server is offline.</li>
  <li><b>Run SPMServer</b>: Open Java EE IDE, then in the top menu click on File, then <b>Import</b>, then <b>Existing Maven Project</b> choosing as Rood Directory the folder SPMServer and putting the check on the suggested pom.xml file. Click on finish and wait for the project to be completely imported. This can require several minutes and you will notice the process looking at the bar on the right bottom. Once the project is ready, go to Project Explorer and right click on the root folder SPMServer, then <b>Run As -> Spring Boot</b> App. When the server starts now you can return to your browser where the client part is opened.</li>
</ul>

## Credits
This repository contains the SPM Project work of SSRFC group composed by Scala Simone, Scala Emanuele, Rosati Marcello, Fedeli Arianna and Calise Francesco, under the supervision of professors Morichetta Andrea and Fornari Fabrizio.


https://shields.io
[![Build Status](http://pros.unicam.it:8080/jenkins/buildStatus/icon?job=PROSLab_SPM-2018-SSRFC)](http://pros.unicam.it:8080/jenkins/me/my-views/view/all/job/PROSLab_SPM-2018-SSRFC/) 
![CRAN/METACRAN](https://img.shields.io/cran/l/devtools.svg)
