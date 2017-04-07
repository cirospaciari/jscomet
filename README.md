How install:

npm install -g jscomet

How use:

Project types available: app, console, library. (Desktop and web coming soon)

Command line:

        version                                  show JSComet version
        clean                                    clean all projects
        clean %PROJECT_NAME%                     clean a project
        build %PROJECT_NAME%                     build a project
        create solution                          create a empty solution file
        create %PROJECT_TYPE% %PROJECT_NAME%     create a project
        remove %PROJECT_NAME%                    remove a project
        run %PROJECT_NAME%                       run a project
        publish %PROJECT_NAME% %OUT_DIRECTORY%   publish a project to folder

        reference add %PROJECT_NAME% %REFERENCE_PROJECT_NAME%            add project reference
        reference remove %PROJECT_NAME% %REFERENCE_PROJECT_NAME%         remove project reference
        add %FILE_TEMPLATE% %PROJECT_NAME% %FILE_PATH%                   add a file
         Default Options:
          add html MyProject myHTMLFile
          add xml MyProject myXMLFile
          add js MyProject myJSFile
          add css MyProject myJSFile
          add class MyProject models\myModelClass
          add class MyProject models\myModelClass extended myModelBase
          add class MyProject models\myModelClass singleton
          add controller MyProject myControllerClass
          add view MyProject user\myView
          add layout MyProject myLayout