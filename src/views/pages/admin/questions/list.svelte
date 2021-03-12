<script lang="ts">
  import LoginCheck from '../../../components/LoginCheck.svelte';
  import Loader from '../../../components/Loader.svelte';
  import { Auth } from '../../../../config/firebase';
  import {loggedIn} from '../../../../stores/current_user';
  import {Datatable, rows} from 'svelte-simple-datatables';

  let data: { id: number, question: string}[] = [];

  $: if ($loggedIn) {
    Auth.currentUser.getIdToken()
      .then((token) => {
        return fetch(
          //'https://europe-west3-bmbf-research-agenda.cloudfunctions.net/api/questions',
          'http://localhost:5000/assets/data/questions.json',
          {
            headers: {'Authorization': `Bearer ${token}`}
          }
        );
      })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        data = response.result;
      });
  }

  const tableSettings = {
    sortable: true,
    pagination: true,
    rowPerPage: 10,
    scrollY: false,
    columnFilter: true,
  };

  let tRows: {id: number, question: string}[] = [];

  $: tRows = $rows;
</script>

<LoginCheck>
  {#if data.length > 0}
  <div class="datatable-question">
    <Datatable settings={tableSettings} data={data}>
      <thead>
        <th class="sortable asc desc" data-key="id">ID</th>
        <th class="sortable asc desc" data-key="question">Question</th>
      </thead>
      <tbody>
      {#each tRows as row }
          <tr>
              <td>{row.id}</td>
              <td>{row.question}</td>
          </tr>
      {/each}
      </tbody>
    </Datatable>
  </div>
  {:else}
  <Loader />
  {/if}
</LoginCheck>