# Semi-automatic causal graph construction system
Semi-automatic causal graph construction system is located on the platform for automatic causality extraction, manual graph construction and field data visualization. Combing automatic and manual construction method to produce relational graph, system supports field data query, deep relation search, and visualization on basis of the constructed relational graph to help identify, display and analyze causality.

## system interface
In the construction system, the layout of the top bar and main content container is used. By clicking on different tabs in the top bar, you can switch the corresponding function pages of the content container.

### 1.Home page 
![avatar](https://github.com/silenceck/Visualization-of-relation/blob/master/screen/1.png)  
On the system home page, the top bar contains the search box for keyword search, navigation bar, and the logged-in user name; the overview diagram shows the field name of some causal graphs and knowledge graphs which already are in the system. The field names here mainly include: Asia, Alzheimer, Cancer, Heart disease, Cardiovascular disease, Nursing. Select the circular node you click on the domain name, and you will enter the data display page of the corresponding domain.

for example, click on the Nursing node to enter the data display page of the nursing field.  
![avatar](https://github.com/silenceck/Visualization-of-relation/blob/master/screen/2.png)  
The red nodes indicate Intervention, and the gray nodes indicate Outcome. The edge between nodes indicates the intervening relation between them.
* move mouse to the position of a node or a edge, the name of the node or edge will be displayed
* click on one of the nodes, all the nodes and relations related to this node will be displayed, and the name and attribute information will appear in the information card.
* click the field name located above the circular relational diagram to restore the circular relation diagram to the initial form.
Users can find the corresponding the name of field data in the tree bar, then the effect of clicking entry is the same as clicking on the node. Users can also search the name in the search box to find the data.

### 2.Graph construction page
Click on the graph construction tab to jump to the graph construction page. There is a relational graph display box on the left side of the page. The right side of the display box provides the function of constructing the knowledge graph.  
![avatar](https://github.com/silenceck/Visualization-of-relation/blob/master/screen/3.png)

#### Construct relational graph 
1. Select the field to which data of the relational graph belongs.
2. Determine the pattern of the entity and what attributes the pattern of entity has. After completing a pattern, item will appear in the pattern list. 
3. Click the Add Entity button, then fill in the attribute value of the entity in the pop-up box. Before adding a relation, users need to determine the name of the entity related to this relation. After users have completed the information of entity and relation data, click the OK button to add the relation. In addition to manually creating pattern to add entities and relations, users can also add entities and relations in bulk by uploading structured data files. While adding entities and the relations between the entities, new entities and relations will appear in the display box in the meantime. 
4. Click the node or edge in the display box, the information of the node or edge will be displayed at the bottom of the box. Click the Update button, the information of the node or edge will be displayed in the pop-up box, after the modification in the input box of the pop-up box, click the Update element to complete the update operation, and click the Delete button to complete the deletion of the corresponding entity or relation.
5. Click the Save button to store the relational graph in the database, after completing the entire construction process.

in addition, there are undo button and redo button above the display box. you can click the button to withdraw the previous series of erroneous operations.
#### Query mode
Click the Query button to switch to the query mode, which supports multiple query conditions and in-depth relation search.
* Single node query: specify the category and attribute of the node, you get all the nodes directly connected to the node, and also limit the relation between the nodes, only query a certain relation.
* Two nodes query: specify the category and attribute of two nodes, you can get all the relations between these two nodes, and the number of relation layers is not limited, and the deep relation can also be queried. 
* Relation query: specify the relation, you get all the nodes whose relation is the specified relation. After the query operation is executed, the query result will appear in the display box, and based on the query result, the editing operation can also be performed. After completing the query operation, you can click to exit the query, and the display box will resume displaying all the nodes and relations.

### 3.Causality extraction page
Click on the causality extraction tab to enter the causality extraction page.  
![avatar](https://github.com/silenceck/Visualization-of-relation/blob/master/screen/4.png)
* enter a piece of text in the text box that needs to extract the relation.
* click the Add Keyword button, specify the keyword set extracted from the text in the keyword box which separated by commas.
* click the Extract causality button to extract the causality. the causality result will be listed in the list below the text box.

### 4.Graph information display page
The personal center displays the related relational graph constructed by the user, All the relational graph information (domain name, the number of nodes, the number of relations and creation time) created by user will be listed in the list, users can view, edit, export, and delete the relational graph data in the list.  
![avatar](https://github.com/silenceck/Visualization-of-relation/blob/master/screen/5.png)
* click view Button, the information of the relational graph will be displayed on the home page.
* click the edit button to display the nodes and relation information of the relational graph on the relational graph construction page You can do some modification work based on the existing relational graph.
* click the export button to export the related relation graph nodes and relation data to the local in the form of csv file.
* click the delete button to delete the relational graph.







