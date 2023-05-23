import { SafeAreaView, FlatList } from 'react-native';

import { styles } from './styles';
import { ExpenseItem } from '../../components';
import { EXPENSES } from '../../constants';

const Expenses = () => {
  const renderItem = ({ item }) => <ExpenseItem item={item} />;
  const keyExtractor = (item) => item.id.toString();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={EXPENSES} renderItem={renderItem} keyExtractor={keyExtractor} />
    </SafeAreaView>
  );
};

export default Expenses;
