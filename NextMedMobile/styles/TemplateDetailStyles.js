import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  topActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    marginTop: 10,
  },
  
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  
  backButton: {
    backgroundColor: '#14967f', // Green
  },
  
  deleteButton: {
    backgroundColor: '#e74c3c', // Red
  },
  
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },  
  
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#093a59",
    marginBottom: 20,
  },
  templateInfoContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  templateInfo: {
    fontSize: 18,
    color: "#093a59",
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#093a59",
    marginBottom: 20,
  },
  fieldContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
  },
  fieldName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00796b",
  },
  fieldDetail: {
    fontSize: 18,
    color: "#00796b",
    marginTop: 8,
  },
  deleteButton: {
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#e74c3c",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  noFieldsText: {
    marginTop: 20,
    fontSize: 18,
    color: "#00796b",
    textAlign: "center",
  },
  addFieldContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#444",
    backgroundColor: "#f9f9f9",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#14967f",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
});

export default styles;
