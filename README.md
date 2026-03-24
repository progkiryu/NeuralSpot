# NeuralSpot

NeuralSpot is a website application that allows users to upload photos in 3 different manners: uploading from device, taking a screenshot, and taking screenshots in 5 second intervals. This is then sent to the AI model for analysis, which returns back a percentage and a summary for possible stroke symptoms. If the percentage exceeds 60%, the website will immediately send out notifications warning for the user to contact emergency services.

## Tech Stack
### - Frontend:
- Vite (development server)
- React (frontend framework)
- TailwindCSS (styling for UI/UX)

### - Backend:
- Flask (web server)
- REST API
- Vercel (deployment)
- AI Model:
    - Pytorch
    - Numpy


## Development:
To run the application in development mode, first clone the repo, then enter the 'server' directory to install the necessary Python packages and start running 'index.py':
```
cd NeuralSpot/server
pip install flask flask-cors numpy torch torchvision numpy pyngrok python-dotenv
python index.py
```
Once the web server is active, change directories to 'client' to install the necessary NPM packages and run Vite's development server:
```
cd ../client
npm i --force
npm run dev
```
After clicking on the link Vite provides, the website should pop up automatically on your browser.
(NOTE: Ignore the "--force" as certain dependencies became deprecrated recently.)

## Production:
To build the application for 'client', simply run:
```
npm run build
```

## Maintenance:
To help contribute, clone the repository and submit changes via pull requests on Github for us to review.


