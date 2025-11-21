To obtain the layout, simply fetch the URL: /port-layout.json.

This JSON file provides the type ("dock", "storageArea") and the position and dimensions so you can draw the 3D objects.

For mapping: Note that each object has an ID (e.g., "DOCK_01"). When you need to display live data (such as occupancy), you must use that ID to make the call to the Backend API (e.g., /api/Docks/DOCK_01 or /api/StorageAreas/YARD_A).