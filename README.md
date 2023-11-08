# oops
IS442 Object Oriented Prgramming - G2T2

## Running the Project

### Prerequisites

[Java](https://www.oracle.com/java/technologies/downloads/#java17) >= 17
[Node.js](https://nodejs.org/en/download) >= 16.17.0

### On Windows

Start Frontend (Make sure you are on project root folder)

```shell
cd client
npm install
npm run start
```

For running backend, from the project root directory, run:
```shell
 cd server
 mvnw spring-boot:run
```

### On OSX/WSL/Linux (Unix-based)

Start Frontend (Make sure you are on project root folder)

```shell
cd client
npm install
npm run start
```

For running backend, from the project root directory, run:
```shell
cd server
./mvnw spring-boot:run
```

# Investment Portfolio Management Backend Application

## Overview
The Investment Portfolio Management API offers a wide range of functionalities for managing investment portfolios, including user authentication, portfolio analytics, and access logs. All stock data is received from https://www.alphavantage.co/

## Authentication
To access secured endpoints, users must authenticate with a JWT included in the Authorization header as a Bearer token.

## API Endpoints
Below is a selection of available API endpoints. This is not an exhaustive list, but it provides insight into the core functionality related to portfolio management:

### Portfolio Management
- `POST /portfolios`: Create a new portfolio.
- `GET /portfolios/{user_id}`: Retrieve a specific portfolio by the user ID.
- `PUT /portfolios/{user_id}`: Update a portfolio by the user ID.
- `DELETE /portfolios/{user_id}`: Delete a portfolio by the user ID.
- `GET /portfolios/paged`: Retrieve all portfolios with pagination.

### Portfolio Stocks
- `POST /portfolioStocks`: Create a new portfolio stock.
- `PUT /portfolioStocks/{id}`: Update a portfolio stock by ID.
- `DELETE /portfolioStocks/{id}`: Delete a portfolio stock by ID.
- `GET /portfolioStocks/{portfolioId}/volatility`: Get monthly volatility of a portfolio.
- `GET /portfolioStocks/{portfolioId}/volatility/annualized`: Get annualized volatility of a portfolio.
- `GET /portfolioStocks/{portfolioId}/summary`: Get a summary of a portfolio.
- `GET /portfolioStocks/{portfolioId}/stocks`: Group portfolio stocks by sector/industry/exchange/country.
- `GET /portfolioStocks/{portfolioId}/stocks/{stockSymbol}`: Get portfolio stock by stock symbol.
- `GET /portfolioStocks/{portfolioId}/stocks/{stockSymbol}/weight`: Get the weight of a stock in a portfolio.
- `GET /portfolioStocks/{portfolioId}/stocks/{stockSymbol}/calculateWeightedReturn`: Calculate the weighted return of a stock.
- `GET /portfolioStocks/{portfolioId}/stocks/{stockSymbol}/calculateAnnualisedReturn`: Calculate the annualised return of a stock.
- `GET /portfolioStocks/`: Retrieve all portfolio stocks.
- `DELETE /portfolioStocks/{portfolioId}/stocks/{stockSymbol}/drop`: Drop a stock from a portfolio.
  
### Access Logs
- `GET /accessLogs`: Retrieve all AccessLogs.
- `GET /accessLogs/user/{user_id}`: Retrieve AccessLogs by user ID.
- `GET /accessLogs/user/{user_id}/portfolio/{portfolio_id}`: Retrieve AccessLogs by user ID and portfolio ID.
- `GET /accessLogs/paged`: Retrieve all AccessLogs with pagination.

### Stock Management
- `POST /stocks`: Create a new stock.
- `PUT /stocks/{stockSymbol}`: Update a stock by its symbol.
- `GET /stocks/{stockSymbol}`: Get a stock by its symbol.
- `DELETE /stocks/{stockSymbol}`: Delete a stock by its symbol.
  
### User Authentication
- `POST /api/v1/auth/register`: Register a new user.
- `POST /api/v1/auth/login`: Authenticate a user and retrieve a token.
- `GET /api/v1/auth/forgotpassword`: Change password for a verified user.

## Schemas
Detailed object schemas are provided, such as `AccessLog`, `Portfolio`, `PortfolioStock`, `Stock`, and `User`, to help users understand the data structure requirements for requests and responses.

## Security
Endpoints are secured with JWT-based authentication, ensuring that only authorized users can access sensitive data and operations.

## Usage
To interact with the API, users should replace path parameters like `{user_id}`, `{portfolioId}`, and `{stockSymbol}` with actual values corresponding to their account and portfolio details. Run the application and visit http://localhost:8080/swagger-ui/index.html for testing.

## Notice
Pkease contact owners for .env sample to try our services locally.

