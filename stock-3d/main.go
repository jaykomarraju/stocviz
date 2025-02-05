package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// List of available stock symbols
var stockSymbols = []string{"AAPL", "XYZ"}

// Handler to list available stocks
func getStockList(c *gin.Context) {
	c.JSON(200, gin.H{"stocks": stockSymbols})
}

// Handler to return stock data
func getStockData(c *gin.Context) {
	symbol := c.Param("symbol")

	// Ensure requested stock is in available list
	valid := false
	for _, s := range stockSymbols {
		if s == symbol {
			valid = true
			break
		}
	}

	if !valid {
		c.JSON(400, gin.H{"error": "Invalid stock symbol"})
		return
	}

	// Read data from JSON file
	filePath := fmt.Sprintf("data/%s.json", symbol)
	data, err := os.ReadFile(filePath)
	if err != nil {
		c.JSON(500, gin.H{"error": "Could not read stock data"})
		return
	}

	// Parse JSON and return response
	var stockData []map[string]interface{}
	if err := json.Unmarshal(data, &stockData); err != nil {
		c.JSON(500, gin.H{"error": "Invalid stock data format"})
		return
	}

	c.JSON(200, stockData)
}

func main() {
	r := gin.Default()

	// Enable CORS
	r.Use(cors.Default())

	r.GET("/api/stocks", getStockList)
	r.GET("/api/stocks/:symbol", getStockData)

	r.Run(":8080")
}
