# Semi-automatic causal graph construction system
Semi-automatic causal graph construction system is located on the platform for causal graph construction, editing and visualization, which mainly focuses on three aspects: causality extraction, relational graph construction, and data visualization. in addition, it supports domain data query and deep relation search.

## system interface
In the construction system, the layout of the top bar and main content container is used. By clicking on different tabs in the top bar, you can switch the corresponding function pages of the content container.

### home page 
![avatar](C:\Users\会议室\Desktop\小论文\图片\系统模块图)
the top bar contains the search box for keyword search, navigation bar, and the logged-in user name; the overview diagram shows the domain’ name information of some causal graphs and knowledge graphs already in the system. The domain names here mainly include: Asia, Alzheimer, Cancer, Nursing. Select the circular node you click on the domain name, and you will enter the data display page of the corresponding domain.

for example, click on the Nursing node to enter the data display page of the nursing field.
![avatar](C:\Users\会议室\Desktop\小论文\图片\系统模块图)
The red nodes indicate Intervention, and the gray nodes indicate Outcome. The connection between nodes indicates the intervening relation between them.
* move mouse to the position of a node or a connection, the name of the node or connection will be displayed
* click on one of the nodes, all the nodes and relations related to this node will be displayed, and the name and attribute information will appear in the information card.
* click the field name located above the circular relational diagram to restore the circular relation diagram to the initial form.

### Relational graph construction page
Click on the relational graph construction tab to jump to the relational graph construction page. There is a knowledge graph display box on the left side of the page. The right side of the display box provides the function of constructing the knowledge graph.
![avatar](C:\Users\会议室\Desktop\小论文\图片\系统模块图)

#### Construct relational graph 
* Make sure that data of the relational graph belongs to which domain.
* Click Add model button to add the model of instance. input the property of model.
* Click the Add Instance button, fill in the attribute value to add the instance data of the category at the right of the attribute box.
* Click the Add Relation button to add the relation of the nodes. In addition, you can click select file button to add instances and relations in bulk.
* Click the node or link in the display box, the information of the node or link will be displayed at the bottom of the display box.
* Click the Update button, the information of the node or link will be displayed in the pop-up box, after the modification in the input box of the pop-up box, click the Update element to complete the update operation.
* Click the Delete button to complete the deletion operation of the corresponding node or relation.
in addition, there are undo button and redo button above the display box. you can click the button to complete the undo and redo opreation.
#### Query model
Click the Query button to switch to the query mode, which supports multiple query conditions and in-depth relation search.
* Single node query: specify the category and attribute of the node, you get all the nodes directly connected to the node, and also limit the relation between the nodes, only query a certain relation.
* Two nodes query: specify the category and attribute of two nodes, you can get all the relations between these two nodes, and the number of relation layers is not limited, and the deep relation can also be queried. 
* Relation query: specify the relation, you get all the nodes whose relation is the specified relation. After the query operation is executed, the query result will appear in the display box, and based on the query result, the editing operation can also be performed. After completing the query operation, you can click to exit the query, and the display box will resume displaying all the nodes and relations.

### Causality extraction page
Click on the causality extraction tab to enter the causality extraction page
* enter a piece of text in the text box that needs to extract the relation.
* click the Add Keyword button, specify the keyword set extracted from the text in the keyword box which separated by commas.
* click the Extract causality button to extract the causality. the causality result will be listed in the list below the text box.

### Relation graph information display page
The personal center displays the related relational graph constructed by the user, as shown in Figure 5 , All the relational graph information (domain name, node number, relation number and creation time) created by all users will be listed in the list, users can view, edit, export, and delete the relational graph data in the list.
* click view Button, the information of the relational graph will be displayed on the home page.
* click the edit button to display the nodes and relation information of the relational graph on the relational graph construction page You can do some modification work based on the existing relational graph.
* click the export button to export the related relation graph nodes and relation data to the local in the form of csv file.
* click the delete button to delete the relational graph.







