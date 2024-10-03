# Currency Converter Application

This is a simple yet advanced currency converter application built using **HTML**, **CSS**, and **JavaScript**. The application allows users to convert between different currencies, featuring a modern 3D look with currency icons. It is containerized using **Docker** and served via **Nginx** for a seamless user experience.

## Features

- Convert between multiple currencies
- Modern, 3D user interface with currency icons next to currency names
- Multiple theme selections (Light, Dark, Blue, Purple)
- Swap currencies functionality
- View conversion history and favorite conversions
- Fully containerized using Docker for easy deployment

## Prerequisites

- **Docker** must be installed on your machine.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/currency-converter-app.git
cd currency-converter-app
```

### 2. Build the Docker Image

```bash
docker build -t currency-converter-app .
```

### 3. Run the Docker Container

```bash
docker run -p 8080:80 currency-converter-app
```

### 4. Access the Application

Open your web browser and navigate to [http://localhost:8080](http://localhost:8080) to access the currency converter application.

## Project Structure

```bash
currency-converter-app/
├── Dockerfile         # Docker configuration file for containerization
├── .dockerignore      # Exclude unnecessary files from the Docker build
├── index.html         # HTML file for the application structure
├── styles.css         # CSS file for styling the application
└── scripts.js         # JavaScript file for application logic
```

### Dockerfile

```dockerfile
# Use the official Nginx image as the base image
FROM nginx:latest

# Copy the static files to the Nginx HTML directory
COPY . /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
```

## Usage Instructions

1. **Enter the amount**: Input the amount you wish to convert.
2. **Select currencies**: Choose the currencies you want to convert from and to.
3. **Convert**: Click the "Convert" button to see the conversion result.
4. **Swap currencies**: Use the swap button to switch the selected currencies.
5. **Change theme**: Select a theme from the theme selector dropdown to personalize the appearance.
6. **View history and favorites**: Use the tabs to access your conversion history and favorite conversions.

## Themes Available

- **Light**: Clean and bright.
- **Dark**: A sleek and modern look.
- **Blue**: Cool and refreshing.
- **Purple**: A unique, stylish theme.

## Figure

![image](https://github.com/user-attachments/assets/ff9e4cdc-66bc-4b91-864f-05bdd462b2a8)

![image](https://github.com/user-attachments/assets/04f47787-54a3-4540-a980-276d60b9593a)

![image](https://github.com/user-attachments/assets/af6d9989-4bc3-457a-b36e-f83cd328cba3)

![image](https://github.com/user-attachments/assets/1597811b-565b-4329-bfa9-b74c4e6c3bb5)

![image](https://github.com/user-attachments/assets/a55f8d50-8944-46f1-a9b8-6b3b1873d0d6)








