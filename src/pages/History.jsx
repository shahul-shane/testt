import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaDownload, FaEye, FaSearch, FaSort, FaArrowLeft } from 'react-icons/fa';
import { techTheme, TechButton } from '../components/TechStyles';
import Navbar from '../components/Navbar';
import ConfirmationPopup from '../components/ConfirmationPopup';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HistoryContainer = styled.div`
  background: ${techTheme.colors.background};
  min-height: 100vh;
  min-width: 100vw;
  padding: 100px 0 2rem;
  position: relative;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 0 3rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: ${techTheme.colors.text.primary};
  font-size: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    color: ${techTheme.colors.primary};
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: ${techTheme.colors.surface};
  border: 1px solid ${techTheme.colors.border};
  border-radius: 12px;
  padding: 0.5rem 1rem;
  width: 300px;

  input {
    background: none;
    border: none;
    color: ${techTheme.colors.text.primary};
    width: 100%;
    outline: none;

    &::placeholder {
      color: ${techTheme.colors.text.secondary};
    }
  }

  svg {
    color: ${techTheme.colors.text.secondary};
  }
`;

const TableContainer = styled.div`
  background: ${techTheme.colors.surface};
  border: 1px solid ${techTheme.colors.border};
  border-radius: 16px;
  overflow-x: auto;
  max-width: 100%;
  
  @media (max-width: 1200px) {
    margin: 0 -1rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const Th = styled.th`
  background: ${techTheme.colors.surfaceLight};
  color: ${techTheme.colors.text.primary};
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  white-space: nowrap;

  &:nth-child(1) { width: 5%; }
  &:nth-child(2) { width: 10%; }
  &:nth-child(3) { width: 25%; }
  &:nth-child(4) { width: 15%; }
  &:nth-child(5) { width: 10%; }
  &:nth-child(6) { width: 15%; }
  &:nth-child(7) { width: 20%; }

  &:hover {
    background: ${techTheme.colors.surface};
  }

  svg {
    margin-left: 0.5rem;
    opacity: 0.5;
  }
`;

const Td = styled.td`
  padding: 1rem;
  color: ${techTheme.colors.text.secondary};
  border-top: 1px solid ${techTheme.colors.border};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 80px;
`;

const Tr = styled.tr`
  transition: all 0.3s ease;

  &:hover {
    background: ${techTheme.colors.surfaceLight};
  }
`;

const ActionButton = styled(TechButton)`
  && {
    min-width: unset;
    padding: 0.4rem;
    margin: 0 0.25rem;
    font-size: 0.9rem;
  }
`;

const ComplianceIndicator = styled.div`
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  background: ${props => 
    props.value >= 70 ? `${techTheme.colors.success}20` :
    props.value >= 40 ? `${techTheme.colors.warning}20` :
    `${techTheme.colors.accent}20`
  };
  color: ${props => 
    props.value >= 70 ? techTheme.colors.success :
    props.value >= 40 ? techTheme.colors.warning :
    techTheme.colors.accent
  };
  display: inline-block;
  font-size: 0.9rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${techTheme.colors.surfaceLight};
  border-top: 1px solid ${techTheme.colors.border};
`;

const PageButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageInfo = styled.div`
  color: ${techTheme.colors.text.secondary};
`;

const TypeTag = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-block;
  
  ${props => props.type === 'Batch' ? `
    background: ${techTheme.colors.primary}15;
    color: ${techTheme.colors.primary};
    border: 1px solid ${techTheme.colors.primary}30;
  ` : `
    background: ${techTheme.colors.success}15;
    color: ${techTheme.colors.success};
    border: 1px solid ${techTheme.colors.success}30;
  `}
`;

const StatusTag = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-block;
  
  ${props => props.status === 'Processed' ? `
    background: ${techTheme.colors.success}15;
    color: ${techTheme.colors.success};
    border: 1px solid ${techTheme.colors.success}30;
  ` : `
    background: ${techTheme.colors.warning}15;
    color: ${techTheme.colors.warning};
    border: 1px solid ${techTheme.colors.warning}30;
  `}
`;

const BackButtonIcon = styled(FaArrowLeft)`
  font-size: 1.2rem;
  cursor: pointer;
`;

const History = () => {
  const { logout } = useAuth();
  const [showSignOutPopup, setShowSignOutPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Sample data - replace with actual data from your backend
  const historyData = [
    {
      id: 1,
      type: 'Normal',
      companyName: 'Tech Corp',
      timestamp: '2024-03-20T10:30:00',
      adCount: 1,
      complianceScore: 85,
      status: 'Processed'
    },
    {
      id: 2,
      type: 'Batch',
      companyName: 'Marketing Pro',
      timestamp: '2024-03-19T15:45:00',
      adCount: 5,
      complianceScore: 65,
      status: 'Processing'
    },
    // Add more items...
  ];

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setShowSignOutPopup(false);
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  // Filter and sort data
  const filteredData = historyData
    .filter(item => 
      item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <HistoryContainer>
      <ConfirmationPopup
        isOpen={showSignOutPopup}
        onClose={() => setShowSignOutPopup(false)}
        onConfirm={handleSignOut}
        title="Are you sure you want to sign out?"
      />
      <Navbar onSignOutClick={() => setShowSignOutPopup(true)} />
      
      <Content>
        <Header>
          <Title>
            <BackButtonIcon onClick={handleBack}>
              <FaArrowLeft />
            </BackButtonIcon>
            <FaCalendarAlt /> Analysis History
          </Title>
          <SearchBar>
            <FaSearch />
            <input
              type="text"
              placeholder="Search by company or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
        </Header>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>S.No</Th>
                <Th onClick={() => handleSort('type')} active={sortConfig.key === 'type'}>
                  Type {sortConfig.key === 'type' && <FaSort />}
                </Th>
                <Th onClick={() => handleSort('companyName')} active={sortConfig.key === 'companyName'}>
                  Company {sortConfig.key === 'companyName' && <FaSort />}
                </Th>
                <Th onClick={() => handleSort('timestamp')} active={sortConfig.key === 'timestamp'}>
                  Date {sortConfig.key === 'timestamp' && <FaSort />}
                </Th>
                <Th onClick={() => handleSort('adCount')} active={sortConfig.key === 'adCount'}>
                  Ads {sortConfig.key === 'adCount' && <FaSort />}
                </Th>
                <Th onClick={() => handleSort('status')} active={sortConfig.key === 'status'}>
                  Status {sortConfig.key === 'status' && <FaSort />}
                </Th>
                <Th onClick={() => handleSort('complianceScore')} active={sortConfig.key === 'complianceScore'}>
                  Compliance {sortConfig.key === 'complianceScore' && <FaSort />}
                </Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <Tr key={item.id}>
                  <Td>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                  <Td>
                    <TypeTag type={item.type}>{item.type}</TypeTag>
                  </Td>
                  <Td>{item.companyName}</Td>
                  <Td>{new Date(item.timestamp).toLocaleDateString()}</Td>
                  <Td>{item.adCount}</Td>
                  <Td>
                    <StatusTag status={item.status}>{item.status}</StatusTag>
                  </Td>
                  <Td>
                    <ComplianceIndicator value={item.complianceScore}>
                      {item.complianceScore}%
                    </ComplianceIndicator>
                  </Td>
                  <Td>
                    <ActionButton title="View Report">
                      <FaEye />
                    </ActionButton>
                    <ActionButton title="Download Report">
                      <FaDownload />
                    </ActionButton>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <PageInfo>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </PageInfo>
            <PageButtons>
              <TechButton
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </TechButton>
              <TechButton
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </TechButton>
            </PageButtons>
          </Pagination>
        </TableContainer>
      </Content>
    </HistoryContainer>
  );
};

export default History;